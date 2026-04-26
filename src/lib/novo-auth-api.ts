import { env } from "@/lib/env";
import type {
  AccesosAdmin,
  ApiResult,
  NegocioAdmin,
  PermisoAdmin,
  ProductoNovo,
  RolAdmin,
  UsuarioAdmin,
} from "@/types/admin";

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === "object") {
    const maybeData = (value as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as T[];
    }
  }

  return [];
}

function toRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function getFirstString(
  source: Record<string, unknown>,
  keys: string[],
  fallback = "",
) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
  }

  return fallback;
}

function getStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => asString(item).trim())
    .filter(Boolean);
}

function getFirstStringArray(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const array = getStringArray(source[key]);
    if (array.length) {
      return array;
    }
  }

  return [];
}

function normalizeAccesos(value: unknown): AccesosAdmin {
  const source = toRecord(value);
  const accesos: AccesosAdmin = {};

  for (const [producto, rawAcceso] of Object.entries(source)) {
    const acceso = toRecord(rawAcceso);
    accesos[producto] = {
      rolId: getFirstString(acceso, ["rolId", "rol_id", "idRol"]),
      rol: getFirstString(acceso, ["rol", "rolNombre", "nombreRol"], "Sin rol"),
      permisos: getStringArray(acceso.permisos),
    };
  }

  return accesos;
}

function normalizeUsuario(rawValue: unknown): UsuarioAdmin {
  const raw = toRecord(rawValue);
  const negocioRaw = toRecord(raw.negocio);

  return {
    id: getFirstString(raw, ["id", "usuarioId"]),
    nombre: getFirstString(raw, ["nombre", "name", "fullName"], "Sin nombre"),
    email: getFirstString(raw, ["email", "correo"], "Sin email"),
    rolGlobal: getFirstString(raw, ["rolGlobal", "rol_global", "rol"], "Sin rol"),
    productos: getFirstStringArray(raw, ["productos", "productosActivos", "productos_activos"]),
    negocioId:
      getFirstString(raw, ["negocioId", "negocio_id"]) ||
      getFirstString(negocioRaw, ["id"]) ||
      null,
    negocio: negocioRaw.id || negocioRaw.nombre
      ? {
          id: getFirstString(negocioRaw, ["id"]),
          nombre: getFirstString(negocioRaw, ["nombre", "name"], "Sin negocio"),
        }
      : null,
    accesos: normalizeAccesos(raw.accesos),
  };
}

function normalizeNegocio(rawValue: unknown): NegocioAdmin {
  const raw = toRecord(rawValue);
  const productos = getFirstStringArray(raw, [
    "productosActivos",
    "productos_activos",
    "productos",
  ]);

  return {
    id: getFirstString(raw, ["id", "negocioId"]),
    nombre: getFirstString(raw, ["nombre", "name"], "Sin nombre"),
    plan: getFirstString(raw, ["plan"], "Sin plan"),
    productosActivos: productos,
    fechaRegistro: getFirstString(raw, ["fechaRegistro", "fecha_registro", "createdAt", "created_at"]) || null,
    usuarios: toArray(raw.usuarios).map(normalizeUsuario),
  };
}

function normalizeRol(rawValue: unknown, producto: string): RolAdmin {
  const raw = toRecord(rawValue);

  return {
    id: getFirstString(raw, ["id", "rolId"]),
    nombre: getFirstString(raw, ["nombre", "name"], "Sin nombre"),
    descripcion: getFirstString(raw, ["descripcion", "description"]) || null,
    producto: getFirstString(raw, ["producto"], producto),
    permisos: getStringArray(raw.permisos),
  };
}

function normalizePermiso(rawValue: unknown, producto: string): PermisoAdmin {
  const raw = toRecord(rawValue);

  return {
    id: getFirstString(raw, ["id", "permisoId"]),
    clave: getFirstString(raw, ["clave", "key"]),
    nombre: getFirstString(raw, ["nombre", "name"], "Sin nombre"),
    descripcion: getFirstString(raw, ["descripcion", "description"]) || null,
    producto: getFirstString(raw, ["producto"], producto),
  };
}

async function parseErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    return payload.message || payload.error || `Request failed with ${response.status}`;
  } catch {
    return `Request failed with ${response.status}`;
  }
}

async function requestNovoAuth<T>(
  path: string,
  init?: RequestInit,
  map?: (payload: unknown) => T,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${env.novoAuthUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Token": env.serviceToken,
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        message: await parseErrorMessage(response),
      };
    }

    const payload = (await response.json()) as unknown;
    return {
      ok: true,
      data: map ? map(payload) : (payload as T),
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to reach novo-auth-api",
    };
  }
}

export async function getNegocios(params?: { plan?: "cards" | "pos" | "suite" }) {
  const query = params?.plan ? `?plan=${params.plan}` : "";
  return requestNovoAuth<NegocioAdmin[]>(`/api/negocios${query}`, undefined, (payload) =>
    toArray(payload).map(normalizeNegocio),
  );
}

export async function getNegocio(id: string) {
  return requestNovoAuth<NegocioAdmin>(`/api/negocios/${id}`, undefined, normalizeNegocio);
}

export async function getUsuarios(params?: { negocioId?: string; q?: string }) {
  const search = new URLSearchParams();

  if (params?.negocioId) {
    search.set("negocioId", params.negocioId);
  }

  if (params?.q) {
    search.set("q", params.q);
  }

  const query = search.size ? `?${search.toString()}` : "";

  return requestNovoAuth<UsuarioAdmin[]>(`/api/usuarios${query}`, undefined, (payload) =>
    toArray(payload).map(normalizeUsuario),
  );
}

export async function getUsuario(id: string) {
  return requestNovoAuth<UsuarioAdmin>(`/api/usuarios/${id}`, undefined, normalizeUsuario);
}

export async function getUsuarioAccesos(id: string) {
  return requestNovoAuth<AccesosAdmin>(`/api/usuarios/${id}/accesos`, undefined, normalizeAccesos);
}

export async function getRoles(producto: ProductoNovo) {
  return requestNovoAuth<RolAdmin[]>(`/api/roles?producto=${producto}`, undefined, (payload) =>
    toArray(payload).map((item) => normalizeRol(item, producto)),
  );
}

export async function getRol(id: string, producto: ProductoNovo) {
  return requestNovoAuth<RolAdmin>(`/api/roles/${id}`, undefined, (payload) =>
    normalizeRol(payload, producto),
  );
}

export async function getPermisos(producto: ProductoNovo) {
  return requestNovoAuth<PermisoAdmin[]>(
    `/api/permisos?producto=${producto}`,
    undefined,
    (payload) => toArray(payload).map((item) => normalizePermiso(item, producto)),
  );
}

export async function updateUsuarioRol(input: {
  id: string;
  producto: string;
  rolId: string;
  negocioId: string;
}) {
  return requestNovoAuth<unknown>(`/api/usuarios/${input.id}/rol`, {
    method: "PUT",
    body: JSON.stringify({
      producto: input.producto,
      rolId: input.rolId,
      negocioId: input.negocioId,
    }),
  });
}

export async function createUsuario(input: {
  nombre: string;
  email: string;
  password: string;
  rolGlobal: string;
  negocioId: string;
  productos: string[];
}) {
  return requestNovoAuth<unknown>(`/api/usuarios`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateUsuario(input: {
  id: string;
  nombre?: string;
  email?: string;
  rolGlobal?: string;
  productos?: string[];
}) {
  return requestNovoAuth<unknown>(`/api/usuarios/${input.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: input.nombre,
      email: input.email,
      rolGlobal: input.rolGlobal,
      productos: input.productos,
    }),
  });
}

export async function deleteUsuario(id: string) {
  return requestNovoAuth<unknown>(`/api/usuarios/${id}`, {
    method: "DELETE",
  });
}

export async function createRol(input: {
  producto: ProductoNovo;
  nombre: string;
  descripcion?: string;
  permisoIds: string[];
}) {
  return requestNovoAuth<unknown>(`/api/roles`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateRol(input: {
  id: string;
  nombre?: string;
  descripcion?: string;
  permisoIds?: string[];
}) {
  return requestNovoAuth<unknown>(`/api/roles/${input.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: input.nombre,
      descripcion: input.descripcion,
      permisoIds: input.permisoIds,
    }),
  });
}

export async function deleteRol(id: string) {
  return requestNovoAuth<unknown>(`/api/roles/${id}`, {
    method: "DELETE",
  });
}

export async function createPermiso(input: {
  producto: ProductoNovo;
  clave: string;
  nombre: string;
  descripcion?: string;
}) {
  return requestNovoAuth<unknown>(`/api/permisos`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updatePermiso(input: {
  id: string;
  nombre?: string;
  descripcion?: string;
}) {
  return requestNovoAuth<unknown>(`/api/permisos/${input.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: input.nombre,
      descripcion: input.descripcion,
    }),
  });
}

export async function deletePermiso(id: string) {
  return requestNovoAuth<unknown>(`/api/permisos/${id}`, {
    method: "DELETE",
  });
}

export async function updateNegocio(input: {
  id: string;
  nombre?: string;
  plan?: string;
  productos?: string[];
}) {
  return requestNovoAuth<unknown>(`/api/negocios/${input.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      nombre: input.nombre,
      plan: input.plan,
      productos: input.productos,
    }),
  });
}

export async function deleteNegocio(id: string) {
  return requestNovoAuth<unknown>(`/api/negocios/${id}`, {
    method: "DELETE",
  });
}

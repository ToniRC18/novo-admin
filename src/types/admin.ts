export type ProductoNovo = "cards" | "pos" | "kitchen";

export type AccesosAdmin = {
  [producto: string]: {
    rolId: string;
    rol: string;
    permisos: string[];
  };
};

export type NegocioAdmin = {
  id: string;
  nombre: string;
  plan: string;
  productosActivos: string[];
  fechaRegistro: string | null;
  usuarios?: UsuarioAdmin[];
};

export type UsuarioAdmin = {
  id: string;
  nombre: string;
  email: string;
  rolGlobal: string;
  productos?: string[];
  negocioId?: string | null;
  negocio?: {
    id: string;
    nombre: string;
  } | null;
  accesos?: AccesosAdmin;
};

export type RolAdmin = {
  id: string;
  nombre: string;
  descripcion: string | null;
  producto: string;
  permisos: string[];
};

export type PermisoAdmin = {
  id: string;
  clave: string;
  nombre: string;
  descripcion: string | null;
  producto: string;
};

export type ApiResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      message: string;
    };

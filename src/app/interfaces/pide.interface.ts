export interface Reniec {
    nuDniConsulta: string,
    nuDniUsuario: string,
    nuRucUsuario: string,
    password: string,
}

export interface Menu {
    ID: number;
    DESCRIPCION: string;
    RUTA: string;
    ID_PADRE: number | null;
    GRUPO?: string;
    ICONO?: string;
    children?: Menu[];
}
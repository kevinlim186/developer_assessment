export interface Coords {
    lat: number;
    lon: number;
}

export interface Params {
    rooms: number;
    value: number;
}

export interface House {
    street: string;
    coords: Coords;
    params: Params;
}

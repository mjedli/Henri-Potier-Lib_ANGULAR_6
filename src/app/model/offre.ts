
export interface Offer {
    type: string;
    value: number;
    sliceValue?: number;
}

export interface RootObject {
    offers: Offer[];
}
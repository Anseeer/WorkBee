interface TopItem {
    _id: string;
    count: number;
}

export interface TopThreeResult {
    TopServices: TopItem[];
    TopCategory: TopItem[];
    TopWorker: TopItem[];
    TopUsers: TopItem[];
}

export interface TopThreeResultDTO {
    TopServices: TopItem[];
    TopCategory: TopItem[];
    TopWorker: TopItem[];
    TopUsers: TopItem[];
}

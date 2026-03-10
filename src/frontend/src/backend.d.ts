import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DailySpecial {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
}
export interface MenuItem {
    id: bigint;
    name: string;
    description: string;
    isActive: boolean;
    imageUrl: string;
    category: string;
    price: string;
}
export interface backendInterface {
    addDailySpecial(id: bigint, name: string, description: string, imageUrl: string, isAvailable: boolean): Promise<void>;
    addMenuItem(id: bigint, name: string, category: string, description: string, price: string, imageUrl: string, isActive: boolean): Promise<void>;
    getDailySpecials(): Promise<Array<DailySpecial>>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getMenuItemsByCategory(category: string): Promise<Array<MenuItem>>;
    removeDailySpecial(id: bigint): Promise<void>;
    removeMenuItem(id: bigint): Promise<void>;
    seedDefaultData(): Promise<void>;
    updateDailySpecial(id: bigint, name: string, description: string, imageUrl: string, isAvailable: boolean): Promise<void>;
    updateMenuItem(id: bigint, name: string, category: string, description: string, price: string, imageUrl: string, isActive: boolean): Promise<void>;
}

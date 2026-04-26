export type CategorySeed = {
    name: string;
    children?: CategorySeed[];
};
export declare const branchZoneSeeds: string[];
export declare const pcBuilderComponentSeeds: ({
    name: string;
    slug: string;
    isRequired: boolean;
    allowMultiple?: undefined;
} | {
    name: string;
    slug: string;
    isRequired: boolean;
    allowMultiple: boolean;
})[];
export declare const ccBuilderComponentSeeds: ({
    name: string;
    slug: string;
    isRequired: boolean;
    allowMultiple: boolean;
} | {
    name: string;
    slug: string;
    isRequired: boolean;
    allowMultiple?: undefined;
})[];
export declare const categorySeeds: CategorySeed[];

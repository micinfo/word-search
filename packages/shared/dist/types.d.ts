export interface GameConfig {
    productName: string;
    brandName: string;
    title: string;
    subtitle: string;
    words: string[];
    theme?: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

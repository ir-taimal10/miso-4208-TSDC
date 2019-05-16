export interface IStrategy {
    idStrategy: string;
    idAUT: string;
    name: string;
    description?: string;
    definition: [];
    scriptPath: string;
    creationDate?: Date;
    headed: boolean;
    viewportWidth: number;
    viewportHeight: number;
}
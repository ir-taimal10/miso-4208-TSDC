export interface IStrategy {
    idStrategy: string;
    idAUT: string;
    name: string;
    description?: string;
    tests: [];
    scriptPath: string;
    creationDate?: Date;
}
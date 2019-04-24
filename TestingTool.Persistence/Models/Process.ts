import {IStrategy} from "./Strategy";
import {IAUT} from "./AUT";

export interface IProcess {
    idProcess?: string;
    strategy?: IStrategy;
    aut?: IAUT;
}
export interface Employee {
	name: string;
	state: string;
}

export interface EmployeeWithId extends Employee {
	id: number;
}

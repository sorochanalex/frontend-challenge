import { rest } from 'msw';
import type { DefaultRequestBody } from 'msw';
import type { Employee, EmployeeWithId } from '../types';

const employees: EmployeeWithId[] = [
	{ id: 1, name: 'John Smith', state: 'added' },
	{ id: 2, name: 'Jane Johnson', state: 'in-check' },
	{ id: 3, name: 'Jack Williams', state: 'approved' },
	{ id: 4, name: 'Jess Brown', state: 'active' },
	{ id: 5, name: 'Jill Jones', state: 'inactive' },
];

export const handlers = [
	rest.get<DefaultRequestBody, EmployeeWithId[]>(
		'/employees',
		(req, res, ctx) => res(ctx.delay(), ctx.json(employees)),
	),
	rest.post<Omit<Employee, 'state'>, EmployeeWithId>(
		'/employees',
		(req, res, ctx) => {
			const employee: EmployeeWithId = {
				id: employees.length + 1,
				...req.body,
				state: 'added',
			};
			employees.push(employee);

			return res(ctx.delay(), ctx.json(employee));
		},
	),
	rest.patch<Pick<Employee, 'state'>, EmployeeWithId, { id: string }>(
		'/employees/:id',
		(req, res, ctx) => {
			const id = Number(req.params.id);

			employees[id - 1].state = req.body.state;

			return res(ctx.delay(), ctx.json(employees[id - 1]));
		},
	),
];

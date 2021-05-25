import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import States from './States';
import { QUERY_KEY } from './queryKey';
import styles from './Employees.module.scss';
import type { Employee, EmployeeWithId } from './types';

export default function Employees() {
	const [newEmployeeName, setNewEmployeeName] = useState('');

	const queryClient = useQueryClient();

	const { data } = useQuery(QUERY_KEY, () =>
		fetch('/employees').then(
			(response): Promise<EmployeeWithId[]> => response.json(),
		),
	);

	const newEmployeeMutation = useMutation(
		(employee: Omit<Employee, 'state'>) =>
			fetch('/employees', {
				method: 'POST',
				body: JSON.stringify(employee),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((response): Promise<EmployeeWithId> => response.json()),
		{
			onSuccess: (newEmployee) => {
				queryClient.setQueryData<EmployeeWithId[]>(QUERY_KEY, (data) => [
					...(data || []),
					newEmployee,
				]);
				setNewEmployeeName('');
			},
		},
	);

	return (
		<div className={styles.main}>
			{data ? (
				<>
					<ol className={styles.list}>
						{data.map((employee) => (
							<li className={styles.employee} key={employee.id}>
								<div>{employee.name}</div>
								<States employee={employee} />
							</li>
						))}
					</ol>
					<form
						onSubmit={(event) => {
							event.preventDefault();

							newEmployeeMutation.mutate({ name: newEmployeeName });
						}}
						className={styles.newEmployee}
					>
						<input
							value={newEmployeeName}
							onChange={(event) => {
								setNewEmployeeName(event.target.value);
							}}
							required={true}
							disabled={newEmployeeMutation.isLoading}
							className={styles.newEmployeeInput}
						/>
						<button
							disabled={newEmployeeMutation.isLoading}
							className={styles.newEmployeeButton}
						>
							Save
						</button>
					</form>
				</>
			) : (
				<div className={styles.loadingMessage}>Loading...</div>
			)}
		</div>
	);
}

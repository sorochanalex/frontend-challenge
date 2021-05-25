import { useMutation, useQueryClient } from 'react-query';
import { QUERY_KEY } from './queryKey';
import styles from './States.module.scss';
import type { EmployeeWithId } from './types';

export default function States({ employee }: { employee: EmployeeWithId }) {
	const queryClient = useQueryClient();

	const updateEmployeeMutation = useMutation(
		(state: string) =>
			fetch(`/employees/${employee.id}`, {
				method: 'PATCH',
				body: JSON.stringify({ state }),
				headers: {
					'Content-Type': 'application/json',
				},
			}).then((response): Promise<EmployeeWithId> => response.json()),
		{
			onSuccess: (updatedEmployee) => {
				queryClient.setQueryData<EmployeeWithId[]>(QUERY_KEY, (data) =>
					(data || []).map((employee) =>
						employee.id === updatedEmployee.id ? updatedEmployee : employee,
					),
				);
			},
		},
	);

	return (
		<div className={styles.states}>
			{['added', 'in-check', 'approved', 'active', 'inactive'].map((state) => (
				<div
					className={
						state === employee.state && !updateEmployeeMutation.isLoading
							? styles.selectedState
							: styles.state
					}
					key={state}
				>
					<button
						disabled={updateEmployeeMutation.isLoading}
						onClick={() => {
							updateEmployeeMutation.mutate(state);
						}}
						className={styles.stateButton}
					>
						{state}
					</button>
				</div>
			))}
		</div>
	);
}

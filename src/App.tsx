import { QueryClient, QueryClientProvider } from 'react-query';
import Employees from './Employees';

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Employees />
		</QueryClientProvider>
	);
}

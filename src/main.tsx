import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from 'next-themes'
import { installFetchInterceptor } from './lib/base-url'

installFetchInterceptor();

const rootEl = document.getElementById("root")!;
const splash = document.getElementById('app-splash');
if (splash) { try { splash.remove(); } catch (e) {  } }
document.documentElement.classList.add('preload');

createRoot(rootEl).render(
	<ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="simplicadet-theme">
		<App />
	</ThemeProvider>
);
requestAnimationFrame(() => {
	requestAnimationFrame(() => {
		document.documentElement.classList.remove('preload');
	});
});

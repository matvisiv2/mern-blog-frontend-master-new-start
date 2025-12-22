import Container from "@mui/material/Container";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components";
import { AddPost, FullPost, Home, Login, Registration } from "./pages";
import { fetchAuthMe } from "./redux/slices/auth";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAuthMe());
	}, [dispatch]);

	return (
		<>
			<Header />
			<Container maxWidth="lg">
				<Routes>
					<Route path={`${process.env.PUBLIC_URL}/`} element={<Home />} />
					<Route
						path={`${process.env.PUBLIC_URL}/posts/:id`}
						element={<FullPost />}
					/>
					<Route
						path={`${process.env.PUBLIC_URL}/posts/:id/edit`}
						element={<AddPost />}
					/>
					<Route path={`${process.env.PUBLIC_URL}/add-post`} element={<AddPost />} />
					<Route path={`${process.env.PUBLIC_URL}/login`} element={<Login />} />
					<Route
						path={`${process.env.PUBLIC_URL}/register`}
						element={<Registration />}
					/>
				</Routes>
			</Container>
		</>
	);
}

export default App;

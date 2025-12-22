import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMe, logout, selectIsAuth } from "../../redux/slices/auth";
import styles from "./Header.module.scss";

export const Header = () => {
	const isAuth = useSelector(selectIsAuth);
	const me = useSelector(getMe);
	const dispatch = useDispatch();

	const onClickLogout = () => {
		if (window.confirm("Are you sure you want to logout?")) {
			dispatch(logout());
			window.localStorage.removeItem("token");
		}
	};

	return (
		<div className={styles.root}>
			<Container maxWidth='lg'>
				<div className={styles.inner}>
					<Link className={styles.logo} to={process.env.PUBLIC_URL}>
						<div>HOME</div>
					</Link>
					<div>{me?.fullName}</div>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<Link to={`${process.env.PUBLIC_URL}/add-post`}>
									<Button variant='contained'>Create a post</Button>
								</Link>
								<Button onClick={onClickLogout} variant='contained' color='error'>
									Logout
								</Button>
							</>
						) : (
							<>
								<Link to={`${process.env.PUBLIC_URL}/login`}>
									<Button variant='outlined'>Login</Button>
								</Link>
								<Link to='/register'>
									<Button variant='contained'>Register</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import styles from "./Login.module.scss";

export const Login = () => {
	const isAuth = useSelector(selectIsAuth);

	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		// setError,
		formState: {
			errors
			// isValid
		}
	} = useForm({
		defaultValues: {
			email: "Petro@gmail.com",
			password: "Petro@gmail.com"
		},
		mode: "onChange"
		// mode: 'all',
	});

	const onSubmit = async (values) => {
		const data = await dispatch(fetchAuth(values));

		if (!data.payload) {
			return alert("Authorization failed");
		}
		if ("token" in data.payload) {
			window.localStorage.setItem("token", data.payload.token);
		}
	};

	if (isAuth) {
		return <Navigate to={`${process.env.PUBLIC_URL}/`} />;
	}

	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant='h5'>
				Login
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label='E-Mail'
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					type='email'
					{...register("email", { required: "Enter email" })}
					fullWidth
				/>
				<TextField
					className={styles.field}
					label='Password'
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register("password", { required: "Enter password" })}
					fullWidth
				/>
				<Button type='submit' size='large' variant='contained' fullWidth>
					Login
				</Button>
			</form>
		</Paper>
	);
};

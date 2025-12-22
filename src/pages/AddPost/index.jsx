import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import "easymde/dist/easymde.min.css";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import axios from "../../axios";
import { selectIsAuth } from "../../redux/slices/auth";
import styles from "./AddPost.module.scss";

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const isAuth = useSelector(selectIsAuth);

	const [isLoading, setLoading] = React.useState(false);
	const [text, setText] = React.useState("");
	const [title, setTitle] = React.useState("");
	const [tags, setTags] = React.useState("");
	const [imageUrl, setImageUrl] = React.useState("");
	const inputFileRef = React.useRef(null);

	React.useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title);
					setText(data.text);
					setTitle(data.title);
					setImageUrl(data.imageUrl);
					setTags(data.tags.join(","));
				})
				.catch((err) => {
					console.warn(err);
					alert("Erro: failed to load post");
				});
		}
	}, [id]);

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: "400px",
			autofocus: true,
			placeholder: "Enter text...",
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append("image", file);
			const { data } = await axios.post("/upload", formData);
			setImageUrl(data.url);
		} catch (err) {
			console.log("Uploading file error.");
			console.warn(err);
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl("");
	};

	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setLoading(true);

			const fields = {
				title,
				text,
				tags,
				imageUrl,
			};

			const { data } = id
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post("/posts", fields);

			const _id = id ? id : data._id;

			navigate(`${process.env.PUBLIC_URL}/posts/${_id}`);
		} catch (err) {
			console.log("Creating post error.");
			console.warn(err);
			setLoading(false);
		}
	};

	if (!window.localStorage.getItem("token") && !isAuth) {
		return <Navigate to={process.env.PUBLIC_URL} />;
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant="outlined"
				size="large"
			>
				Preview loading
			</Button>
			<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
			{imageUrl && (
				<>
					<Button variant="contained" color="error" onClick={onClickRemoveImage}>
						Delete
					</Button>
					<img
						className={styles.image}
						src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Post title..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Tags"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				id="SimpleMDE01"
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isLoading ? <CircularProgress size="24px" /> : id ? "Change" : "Post"}
				</Button>
				<a href={process.env.PUBLIC_URL}>
					<Button size="large">Cancel</Button>
				</a>
			</div>
		</Paper>
	);
};

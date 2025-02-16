import { Lock, Mail } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import logo from "../../assets/logo1.png";
import { AuthContext } from "../../context/Auth/AuthContext";
import ColorModeContext from "../../layout/themeContext";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  borderRadius: "16px",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow: "0 8px 32px 0 #090b11",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, #474c4f 0%, #090b11 100%)",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
  },
  "& .MuiInputBase-input": {
    color: "rgba(255, 255, 255, 0.9)",
    paddingLeft: "10px",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const StyledFormLabel = styled(FormLabel)({
  color: "rgba(255, 255, 255, 0.7)",
  marginBottom: "8px",
});

const StyledLink = styled(Link)({
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    color: "rgba(255, 255, 255, 0.9)",
  },
});

const Login = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const { colorMode } = useContext(ColorModeContext);
  const { appName } = colorMode;
  const [user, setUser] = useState({ email: "", password: "" });
  const [allowSignup, setAllowSignup] = useState(false);
  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Por favor, ingrese un email válido.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <>
      <Helmet>
        <title>{appName || "Connectar Soluciones"}</title>
        <link rel="icon" href="/favicon.png" />
      </Helmet>
      <CssBaseline enableColorScheme />
      <SignInContainer>
        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box>
              <img src={logo} alt="Logo" style={{ width: "150px" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 600,
                textAlign: "center",
                fontSize: "clamp(1.5rem, 5vw, 2rem)",
              }}
            >
              ¡Bienvenido de nuevo!
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}
            >
              Accede a tu cuenta para continuar
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handlSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 3,
            }}
          >
            <FormControl>
              <StyledFormLabel htmlFor="email">Tu correo electrónico</StyledFormLabel>
              <StyledTextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="ejemplo@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                onChange={handleChangeInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <StyledFormLabel htmlFor="password">
                  Ingresa tu contraseña
                </StyledFormLabel>
                <StyledLink href="/recovery-password" variant="body2">
                  Olvidé mi contraseña
                </StyledLink>
              </Box>
              <StyledTextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                onChange={handleChangeInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx={{
                borderRadius: "12px",
                padding: "12px",
                background: "#090b11",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                boxShadow: "0 4px 15px #090b11",
                "&:hover": {
                  background: "#282929",
                  transition: "0.5s",
                },
              }}
              endIcon={<SendIcon />}
            >
              Iniciar sesión
            </Button>

            {!allowSignup && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    my: 1,
                  }}
                >
                  <Divider
                    sx={{
                      flex: 1,
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "0.875rem",
                    }}
                  >
                    o
                  </Typography>
                  <Divider
                    sx={{
                      flex: 1,
                      borderColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    textAlign: "center",
                    p: 2,
                    borderRadius: "12px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.9)",
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    ¿Nuevo aquí?
                  </Typography>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    Crea tu cuenta ahora y comienza a usar{" "}
                    {appName || "Connectar Soluciones"}
                    <StyledLink
                      href="/signup"
                      sx={{
                        display: "inline-block",
                        ml: 1,
                        fontWeight: 500,
                        color: "#4CAF50",
                        "&:hover": {
                          color: "#66BB6A",
                        },
                      }}
                    >
                      Regístrate →
                    </StyledLink>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
};

export default Login;
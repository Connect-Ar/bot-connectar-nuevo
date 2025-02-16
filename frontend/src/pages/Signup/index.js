import { CssBaseline, MenuItem, Select } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  Business,
  Mail,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Field, Form, Formik } from "formik";
import qs from "query-string";
import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "react-phone-input-2/lib/style.css";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import logo from "../../assets/logo.png";
import toastError from "../../errors/toastError";
import usePlans from "../../hooks/usePlans";
import ColorModeContext from "../../layout/themeContext";
import { openApi } from "../../services/api";
import { i18n } from "../../translate/i18n";
import { countryRules } from "../../utils/countryRules";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: theme.spacing(2),
    boxSizing: "border-box",
    overflowY: "auto",
    background:
      theme.mode === "light" ? theme.palette.light : theme.palette.dark,
  },
  rightScreen: {
    flex: 1,
    width: "100vw",
    height: "100vh",
    background:
      theme.mode === "light" ? theme.palette.light : theme.palette.dark,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  paper: {
    backgroundColor:
      theme.mode === "light"
        ? "rgba(255, 255, 255, 0.8)"
        : "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(5px)",
    boxShadow:
      theme.mode === "light"
        ? "0 4px 6px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px rgba(0, 0, 0, 0.5)",
    maxHeight: "90vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "100%",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  logoImg: {
    width: "100%",
    maxWidth: "250px",
    height: "auto",
    maxHeight: "120px",
    margin: "0 auto",
  },
  link: {
    fontSize: "16px",
    lineHeight: "24px",
    color: theme.mode === "light" ? "black" : "white",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#f7f7f7",
    borderRadius: "50px",
  },
  span: {
    color: theme.mode === "light" ? "green" : "white",
  },
  spanRed: {
    color: "red",
  },
  iconPassword: {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

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
    maxWidth: "600px",
  },
  [theme.breakpoints.up("md")]: {
    maxWidth: "700px",
  },
  boxShadow: "0 8px 32px 0 #090b11",
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
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
    "&:hover:not(.Mui-focused) fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)",
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
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    color: "rgba(255, 255, 255, 0.9)",
  },
  "& .MuiTypography-body1": {
    marginTop: "8px",
  },
});

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "&:hover:not(.Mui-focused) fieldset": {
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "& .MuiSelect-select": {
    color: "rgba(255, 255, 255, 0.9)",
    padding: "14px",
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  "&.MuiMenuItem-root": {
    padding: "16px",
    borderRadius: "8px",
    margin: "4px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    },
  },
}));

const PlanCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  "& .plan-name": {
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.9)",
  },
  "& .plan-details": {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "0.9rem",
  },
  "& .plan-price": {
    color: "#4CAF50",
    fontWeight: 600,
  },
}));

const getPhoneValidationSchema = (maxLength, countryCode) => {
  return Yup.string()
    .required("El teléfono es obligatorio")
    .matches(
      new RegExp(`^\\d{${11}}$`),
      `Ingrese el número completo en el formato (xx) xxxx xxxx con ${11} dígitos (solo números).`
    );
};

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "¡Muy corto!")
    .max(50, "¡Muy largo!")
    .required("El nombre es obligatorio"),
  companyName: Yup.string()
    .min(2, "¡Muy corto!")
    .max(50, "¡Muy largo!")
    .required("El nombre de la empresa es obligatorio"),
  password: Yup.string()
    .min(8, "")
    .matches(/[a-z]/, " ")
    .matches(/[A-Z]/, " ")
    .required("La contraseña es obligatoria"),
  email: Yup.string().email("Correo electrónico inválido").required("El correo electrónico es obligatorio"),
  termo: Yup.boolean()
    .oneOf([true], "Debes aceptar los términos para continuar.")
    .required("La aceptación de los términos es obligatoria"),
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const { getPlanList } = usePlans();
  const [plans, setPlans] = useState([]);
  const { colorMode } = useContext(ColorModeContext);
  const { appName } = colorMode;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneValidationSchema, setPhoneValidationSchema] = useState(
    getPhoneValidationSchema(13, "BR")
  );
  let companyId = null;
  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const calculateProgress = (password) => {
    let progress = 0;
    if (password.length >= 8) progress += 33;
    if (/[a-z]/.test(password)) progress += 33;
    if (/[A-Z]/.test(password)) progress += 34;
    return progress;
  };

  const initialState = {
    name: "",
    email: "",
    password: "",
    phone: "",
    companyId,
    companyName: "",
    planId: "",
    termo: false,
  };

  const [user] = useState(initialState);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const planList = await getPlanList({ listPublic: false });
      setPlans(planList);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCountryChange = (countryCode) => {
    const rules = countryRules[countryCode.toLowerCase()] || {
      maxLength: 11,
      code: countryCode.toUpperCase(),
    };
    setPhoneValidationSchema(
      getPhoneValidationSchema(rules.maxLength, rules.code)
    );
  };

  const handleSignUp = async (values) => {
    try {
      await openApi.post("/auth/signup", values);
      toast.success("Registro exitoso");
      history.push("/login");
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <>
      <Helmet>
        <title>{appName || "Connectar Soluciones"}</title>
        <link rel="icon" href="/favicon.png" />
      </Helmet>
      <CssBaseline enableColorScheme />
      <SignUpContainer>
        <Card
          sx={{
            background: "linear-gradient(135deg, #474c4f 0%, #090b11 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 4,
              flexDirection: "column",
              alignItems: "center",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Box>
              <img src={logo} className={classes.logoImg} alt="logo" />
            </Box>
            <Typography component="h1" variant="h5">
              Regístrate
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}
            >
              Crea tu cuenta para comenzar
            </Typography>
            <Formik
              initialValues={user}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                ...UserSchema.fields,
                phone: phoneValidationSchema,
              })}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  handleSignUp(values);
                  actions.setSubmitting(false);
                }, 400);
              }}
            >
              {({ touched, errors, isSubmitting, values, setFieldValue }) => (
                <Form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} style={{ width: "100%" }}>
                      <StyledFormLabel>Empresa</StyledFormLabel>
                      <Field
                        as={StyledTextField}
                        variant="outlined"
                        fullWidth
                        size="small"
                        id="companyName"
                        error={
                          touched.companyName && Boolean(errors.companyName)
                        }
                        helperText={touched.companyName && errors.companyName}
                        name="companyName"
                        autoComplete="companyName"
                        autoFocus
                        placeholder="Nombre de tu empresa"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Business
                                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        width: "100%",
                        padding: "8px",
                      }}
                    >
                      <Grid item xs={12}>
                        <StyledFormLabel>Nombre completo</StyledFormLabel>
                        <Field
                          as={StyledTextField}
                          name="name"
                          variant="outlined"
                          size="small"
                          placeholder="Tu nombre completo"
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person
                                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledFormLabel>Teléfono</StyledFormLabel>
                        <Field
                          as={StyledTextField}
                          name="phone"
                          placeholder="(00) 00000-0000"
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                          fullWidth
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone
                                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Box>
                    <Grid item xs={12}>
                      <StyledFormLabel>Correo electrónico</StyledFormLabel>
                      <Field
                        as={StyledTextField}
                        variant="outlined"
                        fullWidth
                        id="email"
                        size="small"
                        placeholder="tucorreo@ejemplo.com"
                        name="email"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        autoComplete="email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Mail
                                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                              />
                            </InputAdornment>
                          ),
                          style: { textTransform: "lowercase" },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledFormLabel>Contraseña</StyledFormLabel>
                      <Field
                        as={StyledTextField}
                        variant="outlined"
                        fullWidth
                        name="password"
                        size="small"
                        placeholder="******"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePasswordVisibility}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff
                                    className={classes.iconPassword}
                                  />
                                ) : (
                                  <Visibility
                                    className={classes.iconPassword}
                                  />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <div
                        style={{
                          width: "100%",
                          marginTop: "10px",
                        }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(values.password)}
                          color="primary"
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            marginTop: "5px",
                          }}
                        >
                          <span
                            className={
                              values.password.length >= 8
                                ? classes.span
                                : classes.spanRed
                            }
                          >
                            8+ caracteres
                          </span>
                          <span
                            className={
                              /[a-z]/.test(values.password)
                                ? classes.span
                                : classes.spanRed
                            }
                          >
                            Minúscula
                          </span>
                          <span
                            className={
                              /[A-Z]/.test(values.password)
                                ? classes.span
                                : classes.spanRed
                            }
                          >
                            Mayúscula
                          </span>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledFormLabel htmlFor="plan-selection">
                        Plan
                      </StyledFormLabel>
                      <Field
                        as={StyledSelect}
                        variant="outlined"
                        fullWidth
                        id="plan-selection"
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: "rgba(25, 25, 25, 0.95)",
                              backdropFilter: "blur(10px)",
                              borderRadius: "12px",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              maxHeight: "400px",
                            },
                          },
                        }}
                        name="planId"
                        required
                        style={{
                          height: 40,
                        }}
                      >
                        {plans.map((plan, key) => (
                          <MenuItem key={key} value={plan.id} size="small">
                            {plan.name} - Atendentes: {plan.users} - WhatsApp:{" "}
                            {plan.connections} - Filas: {plan.queues} - R${" "}
                            {plan.amount}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={values.termo}
                            onChange={(event) => {
                              setFieldValue("termo", event.target.checked);
                            }}
                            color="primary"
                            name="termo"
                            style={{
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          />
                        }
                        style={{
                          alignItems: "flex-center",
                          marginRight: "5px",
                          marginTop: "-8px",
                        }}
                        label={
                          <span
                            style={{
                              textAlign: "justify",
                              fontSize: "14px",
                              paddingTop: "5px",
                              color: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            He leído y acepto los términos de uso.
                          </span>
                        }
                      />
                      {errors.termo && touched.termo ? (
                        <div style={{ color: "red" }}>{errors.termo}</div>
                      ) : null}
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: "12px",
                      padding: "12px",
                      backgroundColor: "#090b11",
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
                    Registrarse
                  </Button>
                  <StyledLink component={RouterLink} to="/login">
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      ¿Ya tienes una cuenta? Inicia sesión
                    </Typography>
                  </StyledLink>
                </Form>
              )}
            </Formik>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
};

export default SignUp;
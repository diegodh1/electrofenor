import React, { useState, useEffect } from "react";
import logo from "./images/electro.png";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@material-ui/core/TextField";
import { GridEvents, useGridApiRef, DataGrid } from "@mui/x-data-grid";
import InputAdornment from "@mui/material/InputAdornment";
import {
  AccountCircle,
  AccessAlarm,
  ThreeDRotation,
} from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "50%",
    },
  },
}));

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [clientId, setClientId] = useState("");
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [logged, setLogged] = useState(false);
  const [isvalid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const [bills, setBills] = useState([]);
  const [monto, setMonto] = useState(0);
  const [monto2, setMonto2] = useState(0);
  const [dataDetalle, setDataDetalle] = useState([]);
  const [referencia, setReferencia] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const options = { style: "currency", currency: "USD" };
  const numberFormat2 = new Intl.NumberFormat("en-US", options);
  //registro
  const [usernameRegistro, setUsernameRegistro] = useState("");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const [email, setEmail] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");

  const classes = useStyles();

  const { height, width } = useWindowDimensions();
  const sizeCols = width / 7;

  const columns = [
    {
      field: "cardCode",
      headerName: "Referencia",
      width: sizeCols,
      editable: false,
    },
    {
      field: "cardName",
      headerName: "Nombre",
      width: sizeCols,
      editable: false,
    },
    {
      field: "docDate",
      headerName: "Fecha Documento",
      width: sizeCols,
      editable: false,
    },
    {
      field: "docDueDate",
      headerName: "Fecha Vencimiento Doc",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: sizeCols,
    },
    {
      field: "billNum",
      headerName: "Num. Factura",
      type: "number",
      width: sizeCols,
      editable: false,
    },

    {
      field: "saldo",
      headerName: "Saldo",
      type: "number",
      width: sizeCols,
      editable: false,
    },
  ];

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  const getAllBillsByClient = (value, token2) => {
    setClientId(value);
    const requestOptions = {
      method: "GET",
    };
    let url =
      "https://electrofrenorr.herokuapp.com/facturas/cliente/" +
      value.toString();

    console.log(url);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let temp = data.map(function (it) {
          return {
            cardCode: it.CardCode,
            cardName: it.CardName,
            docDate: it.DocDate,
            docDueDate: it.DocDueDate,
            billNum: it.DocNum,
            saldo: it.Saldo,
          };
        });
        setBills(temp);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setDataWompi = (ids) => {
    setMonto(0);
    setMonto2(0);
    let data = [];
    let suma = 0;
    let ref = "";
    let filtered = bills.filter(function (element) {
      return ids.includes(element.billNum);
    });
    filtered.forEach((element) => {
      suma = suma + element.saldo;
      ref = element.cardCode;
      data.push({
        reference: ref + "-" + Math.floor(Date.now() / 1000).toString(),
        id: element.billNum,
        amount: element.saldo,
      });
    });
    setMonto(suma * 100);
    setMonto2(suma * 100);
    setReferencia(ref + "-" + Math.floor(Date.now() / 1000).toString());
    setDataDetalle(data);
    setIsValid(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(dataDetalle));
    if (dataDetalle.length == 1) {
      let tmp = dataDetalle;
      tmp[0].amount = monto;
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataDetalle),
    };
    fetch("https://electrofrenorr.herokuapp.com/event/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Status == 200) {
          e.target.submit();
        } else {
          setMessage(data.message);
          setOpen(true);
        }
      })
      .catch((error) => {
        setMessage("No se pudo enviar el registro");
        setOpen(true);
      });
  };

  const setPagoParcial = (value) => {
    let tmpValue = value * 100;
    if (tmpValue > monto2) {
      setMessage(
        "El valor a pagar no puede ser mayor al valor de la factura seleccionada"
      );
      setOpen(true);
      setIsValid(false);
    } else {
      setMonto(tmpValue);
      setIsValid(true);
    }
  };

  const login = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ card_code: username, pass: password }),
    };
    fetch("https://electrofrenorr.herokuapp.com/client/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Status != 200) {
          setMessage(data.Message);
          setOpen(true);
        } else {
          setLogged(true);
          getAllBillsByClient(username, data.Payload.Token);
        }
      })
      .catch((error) => {
        setMessage("No se pudo iniciar sesión");
        setOpen(true);
      });
  };

  const logup = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card_code: usernameRegistro,
        pass: passwordRegistro,
        mail: email,
        num_doc: parseInt(numeroFactura),
      }),
    };
    fetch("https://electrofrenorr.herokuapp.com/client/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.Status != 201) {
          setMessage(data.Message);
          setOpenRegister(false);
          setOpen(true);
        } else {
          setMessage(data.Message);
          setOpenRegister(false);
          setOpenSuccess(true);
        }
      })
      .catch((error) => {
        setMessage("No se pudo iniciar sesión");
        setOpenRegister(false);
        setOpen(true);
      });
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  return (
    <div>
      {logged ? (
        <div className="App">
          <div
            style={{
              height: 400,
              width: "90%",
              marginLeft: "5%",
              marginTop: "2%",
            }}
          >
            <DataGrid
              getRowId={(r) => r.billNum}
              rows={bills}
              onSelectionModelChange={(ids) => {
                console.log(ids);
                if (ids.length) {
                  setDataWompi(ids);
                }
              }}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={true}
              onRowEditCommit={(event) => console.log(event)}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            El monto seleccionado a pagar es {numberFormat2.format(monto / 100)}{" "}
            COP
          </p>
          <p>
            En caso de que desee hacer un pago parcial de una sola factura puede
            editar el valor a pagar
          </p>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              label="Valor a Pagar"
              disabled={dataDetalle.length > 1}
              variant="outlined"
              onChange={(value) => setPagoParcial(value.target.value)}
            />
          </form>
          <form
            onSubmit={handleSubmit}
            action="https://checkout.wompi.co/p/"
            method="GET"
          >
            <input
              type="hidden"
              name="public-key"
              value="pub_test_WNGYQYXRaSqEZXNQXIqcqk2ikAg0VTfU"
            />
            <input type="hidden" name="currency" value="COP" />
            <input type="hidden" name="amount-in-cents" value={monto} />
            <input type="hidden" name="reference" value={referencia} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isvalid}
            >
              Pagar con Wompi
            </Button>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "10%" }}>
          <img src={logo} alt="Logo" />
          <br />
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            style={{ width: "30%", marginTop: "2%" }}
            label="Usuario"
            variant="outlined"
            onChange={(value) => setUsername(value.target.value)}
          />
          <br />
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              ),
            }}
            type="password"
            style={{ width: "30%", marginTop: "2%" }}
            label="Contraseña"
            variant="outlined"
            onChange={(value) => setPassword(value.target.value)}
          />
          <br />
          <Button
            variant="outlined"
            style={{ marginTop: "2%", marginRight: "2%" }}
            onClick={() => setOpenRegister(true)}
          >
            Registrarse
          </Button>
          <Button
            variant="contained"
            style={{ background: "#008000", marginTop: "2%", color: "white" }}
            onClick={() => {
              login();
            }}
          >
            Ingresar Sesión
          </Button>
          <br />
          <Button
            variant="text"
            style={{ marginTop: "2%", color: "#999999" }}
            onClick={() => console.log(true)}
          >
            Recuperar mi contraseña
          </Button>
        </div>
      )}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={() => setOpenSuccess(false)}
      >
        <Alert
          onClose={() => setOpenSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      <Dialog open={openRegister} onClose={handleCloseRegister}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para registrarse debe de tener a la mano el código de usuario
            asociado a su documento y un número de factura vigente
          </DialogContentText>
          <br />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Código de Usuario"
            fullWidth
            variant="standard"
            onChange={(value) => setUsernameRegistro(value.target.value)}
          />
          <br />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Contraseña"
            type="password"
            fullWidth
            onChange={(value) => setPasswordRegistro(value.target.value)}
            variant="standard"
          />
          <br />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange={(value) => setEmail(value.target.value)}
            variant="standard"
          />
          <br />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Escriba un número de factura que tenga asociado y esté vigente"
            fullWidth
            onChange={(value) => setNumeroFactura(value.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseRegister()}>Cancel</Button>
          <Button onClick={() => logup()}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;

import React, {useEffect, useState} from "react";
import logo from "./images/electro.png";
import whatsapp from "./images/whatsapp.png";
import "./App.css";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@material-ui/core/TextField";
import Grid from "@mui/material/Grid";
import {DataGrid} from "@mui/x-data-grid";
import InputAdornment from "@mui/material/InputAdornment";
import {AccountCircle,} from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import LogoutIcon from '@mui/icons-material/Logout';

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "50%",
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  },
}));

//tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Box sx={{ p: 3 }}>
              <Typography component={'span'} variant={'body2'}>{children}</Typography>
            </Box>
        )}
      </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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
  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [logged, setLogged] = useState(false);
  const [recoverPassword, setRecoverPassword] = useState(false);
  const [isvalid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [monto, setMonto] = useState(0);
  const [monto2, setMonto2] = useState(0);
  const [totalCartera, setTotalCartera] = useState(0);
  const [totalVencido, setTotalVencido] = useState(0);
  const [cupoAsignado, setCupoAsignado] = useState(0);
  const [cupoDisponible, setCupoDisponible] = useState(0);
  const [dataDetalle, setDataDetalle] = useState([]);
  const [referencia, setReferencia] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("factura");
  const options = { style: "currency", currency: "USD" };
  const numberFormat2 = new Intl.NumberFormat("en-US", options);
  //registro
  const [usernameRegistro, setUsernameRegistro] = useState("");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const [masterPasswordRegistro, setMasterPasswordRegistro] = useState("");
  const [email, setEmail] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  //tabs
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = useStyles();

  const { width } = useWindowDimensions();
  const sizeCols = width / 9.5;

  const columns = [
    {
      field: "cardCode",
      headerName: "Cod. Usuario",
      minWidth:sizeCols,
      editable: false,
    },
    {
      field: "cardName",
      headerName: "Nombre",
      minWidth: sizeCols,
      editable: false,
    },
    {
      field: "docDate",
      headerName: "Fecha Documento",
      minWidth: sizeCols,
      editable: false,
    },
    {
      field: "docDueDate",
      headerName: "Fecha Vencimiento Doc",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      minWidth: sizeCols,
    },
    {
      field: "state",
      headerName: "Estado",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      minWidth: sizeCols,
    },
    {
      field: "dias_mora",
      align: 'center',
      headerName: "Días en mora",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      minWidth: sizeCols,
    },
    {
      field: "billNum",
      headerName: "Num. Factura",
      minWidth: sizeCols,
      editable: false,
    },

    {
      field: "saldoAux",
      headerName: "Saldo",
      minWidth: sizeCols,
      editable: false,
    },
  ];

  const columnsOffer = [
    {
      field: "cardCode",
      headerName: "Cod. Usuario",
      minWidth: sizeCols,
      editable: false,
    },
    {
      field: "cardName",
      headerName: "Nombre",
      minWidth: sizeCols,
      editable: false,
    },
    {
      field: "docDate",
      headerName: "Fecha Documento",
      minWidth: sizeCols,
      editable: false,
    },
    {
      field: "docDueDate",
      headerName: "Fecha Vencimiento Doc",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      minWidth: sizeCols,
    },
    {
      field: "billNum",
      headerName: "Num. Factura",
      minWidth: sizeCols,
      editable: false,
    },
    {
      field: "saldoAux",
      headerName: "Saldo",
      minWidth: sizeCols,
      editable: false,
    },
  ];

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;
    document.body.appendChild(script);
    let userTmp = localStorage.getItem('username')
    let passTmp = localStorage.getItem('password')
    if(userTmp!== undefined && userTmp !== ''){
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ card_code: userTmp, pass: passTmp }),
      };
      fetch("https://electrofrenorr.herokuapp.com/client/login", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.Status !== 200) {
            console.log(data.Message)
          } else {
            setLogged(true);
            getAllBillsByClient(userTmp, data.Payload.Token);
            getAllOfferssByClient(userTmp, data.Payload.Token);
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
    
  }, []);

  const getAllBillsByClient = (value, token2) => {
    const requestOptions = {
      method: "GET",
    };
    let url =
      "https://electrofrenorr.herokuapp.com/facturas/cliente/" +
      value.toString();

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let tempVencido = 0;
        let tempCartera = 0;
        setTotalCartera(0);
        setTotalVencido(0);
        setCupoAsignado(0);
        setCupoDisponible(0);
        let tempDisponible = 0;
        let temp = data.map(function (it) {
          let today = new Date();
          let splitedDate = it.DocDueDate.split("/");
          let dueDate = new Date(
            splitedDate[2],
            splitedDate[1] - 1,
            splitedDate[0]
          );
          let diffTime = today.getTime() - dueDate.getTime();
          let diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) - 1;
          let estado =
            diffDays > 0
              ? "Vencida"
              : diffDays >= -5
              ? "Por Vencer"
              : "Sin Vencer";
          setCupoAsignado(it["Cupo Asignado"]);
          tempDisponible = it["Cupo Asignado"];
          tempCartera = tempCartera + it.Saldo;
          if (estado === "Vencida") {
            tempVencido = tempVencido + it.Saldo;
          }
          return {
            cardCode: it.CardCode,
            cardName: it.CardName,
            docDate: it.DocDate,
            docDueDate: it.DocDueDate,
            billNum: it.DocNum,
            saldo: it.Saldo,
            saldoAux: "$" + new Intl.NumberFormat("COP").format(it.Saldo),
            doc_entry: it.DocEntry,
            state: estado,
            dias_mora: diffDays,
          };
        });
        setTotalVencido(tempVencido);
        setTotalCartera(tempCartera);
        setCupoDisponible(tempDisponible - tempCartera);
        setBills(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllOfferssByClient = (value, token2) => {
    const requestOptions = {
      method: "GET",
    };
    let url =
        "https://electrofrenorr.herokuapp.com/cliente/ofertas/" +
        value.toString();
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
              saldoAux: "$" + new Intl.NumberFormat("en-IN").format(it.Saldo),
              doc_entry: it.DocEntry
            };
          });
          setOffers(temp);
        })
        .catch((error) => {
          console.log(error);
        });
  };

  const setDataWompi= (ids, type) => {
    let filteredBillsTemp = filteredBills
    let filteredOffersTemp = filteredOffers

    switch (type) {
      case 'bills':
        filteredBillsTemp = bills.filter(function (element) {
          return ids.includes(element.billNum);
        });
        break;
      case 'offers':
        filteredOffersTemp = offers.filter(function (element) {
          return ids.includes(element.billNum);
        });
        break;
    }


    setMonto(0);
    setMonto2(0);
    let data = [];
    let suma = 0;
    let ref = "";
    let filtered = filteredBillsTemp.concat(filteredOffersTemp)

    filtered.forEach((element) => {
      suma = suma + element.saldo;
      ref = element.cardCode;
      data.push({
        reference: ref + "-" + Math.floor(Date.now() / 1000).toString(),
        id: element.billNum,
        amount: element.saldo,
        doc_entry: element.doc_entry,
      });
    });
    setMonto(suma * 100);
    setMonto2(suma * 100);
    setReferencia(ref + "-" + Math.floor(Date.now() / 1000).toString());
    setDataDetalle(data);
    setIsValid(true);
    setFilteredBills(filteredBillsTemp)
    setFilteredOffers(filteredOffersTemp)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dataDetalle.length === 1) {
      dataDetalle[0].amount = monto / 100;
    }

    let tempBills = dataDetalle.map(function (it) {
      return {
        reference: it.reference,
        id: it.id,
        amount: it.amount * 100,
        doc_entry: it.doc_entry,
      };
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tempBills),
    };

    fetch("https://electrofrenorr.herokuapp.com/event/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === 200) {
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
        if (data.Status !== 200) {
          setMessage(data.Message);
          setOpen(true);
        } else {
          setLogged(true);
          localStorage.setItem('username', username)
          localStorage.setItem('password', password)
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
        is_offer: tipoDocumento != "factura"
      }),
    };
    fetch("https://electrofrenorr.herokuapp.com/client/create", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Status !== 201) {
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


  const changePassword = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card_code: usernameRegistro,
        new_pass: passwordRegistro,
        master_pass: masterPasswordRegistro,
      }),
    };
    fetch("https://electrofrenorr.herokuapp.com/client/change/pass", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.Status !== 200) {
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
          <Button style={{position:'fixed', top:0, right:'1%'}}  endIcon={<LogoutIcon />} onClick={()=> {
            setLogged(false);
            localStorage.clear();
          }}>
            Cerrar Sesión
          </Button>
          <h2>Facturas</h2>
          <div
              style={{
                height: 300,
                width: "90%",
                marginLeft: "5%",
                marginTop: "2%",
              }}
          >
          {bills.length > 0 ? (
              <DataGrid
                  getRowId={(r) => r.billNum}
                  rows={bills}
                  onSelectionModelChange={(ids) => {
                    if (ids.length) {
                      setDataWompi(ids,'bills');
                    }
                    else{
                      setDataWompi([],'bills');
                      setIsValid(false)
                    }
                  }}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection={true}
              />
          ) : (
              <p style={{ textAlign: "center" }}>
                Estimado Cliente, No tiene facturas pendientes por pagar.
              </p>
          )}
          </div>
          <h2 style={{marginTop:'2%'}}>Cotizaciones</h2>
          <div
              style={{
                height: 300,
                width: "90%",
                marginLeft: "5%",
                marginTop: "2%",
              }}
          >
          {offers.length > 0 ? (
              <DataGrid
                  style={{marginBottom:'5%'}}
                  getRowId={(r) => r.billNum}
                  rows={offers}
                  onSelectionModelChange={(ids) => {
                    if (ids.length) {
                      setDataWompi(ids,'offers');
                    }
                    else{
                      setDataWompi([],'offers');
                      setIsValid(false)
                    }
                  }}
                  columns={columnsOffer}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection={true}
              />
          ) : (
              <p style={{ textAlign: "center" }}>
                Estimado Cliente, No tiene ofertas disponibles en el momento.
              </p>
          )}
          </div>
          <br/>

          <Grid container spacing={2}>
            <Grid item xs={1}/>
            <Grid item xs={1}>
              <img
                src={whatsapp}
                alt="whatsapp"
                style={{width: "70%" }}
              />
            </Grid>
            <Grid item xs={4} style={{ textAlign: "justify" }}>
              <p>
                Para cualquier necesidad de alguno de nuestros productos, favor
                comunicarse con su asesor, o dar{" "}
                <a
                  href="https://api.whatsapp.com/send/?phone=57321%202537000&text&app_absent=0"
                  target="_blank"
                >
                  Click Aquí
                </a>{" "}
                para comunicarse con uno de nuestros asesores por whatsapp
              </p>
              <p>
                Para comunicarse con alguien de cartera{" "}
                <a
                  href="https://api.whatsapp.com/send/?phone=57300%208250414&text&app_absent=0"
                  target="_blank"
                >
                  Click Aquí
                </a>
              </p>
            </Grid>
            <Grid item xs={1}/>
            <Grid item xs={5} style={{ textAlign: "left"}}>
              <p>Total Cartera {numberFormat2.format(totalCartera)} COP</p>
              <p style={{ color: "red" }}>
                Total Vencido {numberFormat2.format(totalVencido)} COP
              </p>
              <p>Cupo Asignado {numberFormat2.format(cupoAsignado)} COP</p>
              <p>Cupo Disponible {numberFormat2.format(cupoDisponible)} COP</p>
            </Grid>
          </Grid>
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
              style = {{marginBottom:'4%'}}
              id="outlined-basic"
              label="Valor a Pagar"
              disabled={dataDetalle.length > 1}
              variant="outlined"
              onChange={(value) => setPagoParcial(value.target.value)}
            />
          </form>
          <form
           style={{position:'fixed', bottom:0, left:0, right:0}}
            onSubmit={handleSubmit}
            action="https://checkout.wompi.co/p/"
            method="GET"
          >
            <input
              type="hidden"
              name="public-key"
              value="pub_prod_tTJFivVHWPPq61LzO7AQjJO0J3SB2oSd"
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
              Pagar
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
            onClick={() => setRecoverPassword(true)}
          >
            Cambiar contraseña
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
          <br/>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Código de Usuario"
            fullWidth
            variant="standard"
            onChange={(value) => setUsernameRegistro(value.target.value)}
          />
          <br/>
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
          <br/>
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
          <br/><br/>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Tipo de Documento</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="factura"
                onChange={(value) => setTipoDocumento(value.target.value)}
                name="radio-buttons-group">
              <FormControlLabel value="factura" control={<Radio />} label="Factura"/>
              <FormControlLabel value="cotizacion" control={<Radio />} label="Cotización"/>
            </RadioGroup>
          </FormControl>
          <br/>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Escriba un número de documento que tenga asociado y esté vigente"
            fullWidth
            onChange={(value) => setNumeroFactura(value.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseRegister()}>Cancelar</Button>
          <Button onClick={() => logup()}>Suscribirse</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={recoverPassword} onClose={() => setRecoverPassword(false)}>
        <DialogTitle>Recuperar Contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para cambiar contraseña debe de contar con la contraseña secreta de electrofrenor (Solicite por favor este cambio a Electrofrenor en caso de olvidarse de la contraseña).
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
            label="Contraseña Maestra Electrofenor"
            type="password"
            fullWidth
            onChange={(value) => setMasterPasswordRegistro(value.target.value)}
            variant="standard"
          />
          <br />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecoverPassword(false)}>Cancelar</Button>
          <Button onClick={() => changePassword()}>Cambiar Contraseña</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;

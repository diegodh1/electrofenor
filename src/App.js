import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button,} from '@material-ui/core';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@material-ui/core/TextField';
import { GridEvents, useGridApiRef, DataGrid } from '@mui/x-data-grid';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '50%',
    },
  },
}));

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {

  const [clientId, setClientId] = useState('')
  const [open, setOpen] = useState(false)
  const [isvalid, setIsValid] = useState(false)
  const [message, setMessage] = useState('')
  const [bills, setBills] = useState([])
  const [monto, setMonto] = useState(0)
  const [monto2, setMonto2] = useState(0)
  const [referencia, setReferencia] = useState('')
  const options = { style: 'currency', currency: 'USD' };
  const numberFormat2 = new Intl.NumberFormat('en-US', options);

  const classes = useStyles();

  const { height, width } = useWindowDimensions();
  const sizeCols = width / 7;

  const columns = [
    {
      field: 'cardCode',
      headerName: 'Referencia',
      width: sizeCols,
      editable: false,
    },
    {
      field: 'cardName',
      headerName: 'Nombre',
      width: sizeCols,
      editable: false,
    },
    {
      field: 'docDate',
      headerName: 'Fecha Documento',
      width: sizeCols,
      editable: false,
    },
    {
      field: 'docDueDate',
      headerName: 'Fecha Vencimiento Doc',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      width: sizeCols,
    },
    {
      field: 'billNum',
      headerName: 'Num. Factura',
      type: 'number',
      width: sizeCols,
      editable: false,
    },
    
    {
      field: 'saldo',
      headerName: 'Saldo',
      type: 'number',
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
  

  const getAllBillsByClient = (value) => {
    setClientId(value)
    const requestOptions = {
      method: 'GET',
    };
    let url = 'https://electrofrenorr.herokuapp.com/facturas/cliente/' + value.toString()
    fetch(url, requestOptions)
      .then(response => response.json())
      .then(data => {
        let temp = data.map(function (it) {
          return { cardCode: it.CardCode, cardName: it.CardName, docDate: it.DocDate, docDueDate: it.DocDueDate, billNum: it.DocNum, saldo: it.Saldo }
        })
        setBills(temp)
        console.log(data)
      })
      .catch(error => {
        console.log(error)
      });
  }

  const setDataWompi = (id) =>{
    console.log(id)
    let tmp = bills.filter((x)=> x.billNum == id)[0]
    if(tmp != undefined && tmp != null){
      setMonto(tmp.saldo * 100)
      setMonto2(tmp.saldo * 100)
      setReferencia(tmp.cardCode+"-"+tmp.billNum + Math.floor(Date.now() / 1000))
      setIsValid(true)
    }
    console.log(tmp)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = window.confirm("?");
    if (answer) {
      // Save it!
      console.log("Thing was saved to the database.");
    } else {
      // Do nothing!
      console.log("Thing was not saved to the database.");
    }
  };

  const setPagoParcial = (value) =>{
    let tmpValue = value * 100
    if(tmpValue > monto2){
      setMessage("El valor a pagar no puede ser mayor al valor de la factura seleccionada")
      setOpen(true)
      setIsValid(false)
    }
    else{
      setMonto(tmpValue)
      setIsValid(true)
    }
  }

  return (
    <div className="App">
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="outlined-basic" label="Ingresar Código de Usuario" variant="outlined" onChange={value => getAllBillsByClient(value.target.value)} style={{marginTop:'2%'}}/>
      </form>
      <div style={{ height: 400, width: '90%', marginLeft:'5%', marginTop:'2%'}}>
        <DataGrid
          getRowId={(r) => r.billNum}
          rows={bills}
          onSelectionModelChange={(ids) => {
            if(ids.length){
              setDataWompi(ids[ids.length - 1])
            }
          }}
          columns={columns}
          pageSize={5}
          rowSelection='single'
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          onRowEditCommit={(event) => console.log(event)}
    
        />
      </div>
      <p style={{textAlign:'center'}}>El monto seleccionado a pagar es {numberFormat2.format(monto/100)} COP</p>
      <p>En caso de que desee hacer un pago parcial puede editar el valor a pagar</p>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="outlined-basic" label="Valor a Pagar" variant="outlined" onChange={value => setPagoParcial(value.target.value)} />
      </form>
      <form action="https://checkout.wompi.co/p/" method="GET">
        <input type="hidden" name="public-key" value="pub_test_WNGYQYXRaSqEZXNQXIqcqk2ikAg0VTfU" />
        <input type="hidden" name="currency" value="COP" />
        <input type="hidden" name="amount-in-cents" value={monto} />
        <input type="hidden" name="reference" value={referencia} />
        <Button type="submit" variant="contained" color="primary" disabled={!isvalid}>Pagar con Wompi</Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={()=>setOpen(false)}>
        <Alert onClose={()=>setOpen(false)} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;

import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import { Button, TextField } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: '15px'
  },
  formControl: {
    margin: theme.spacing(3),
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  button: {
    margin: theme.spacing(1, 0),
    width: '100%'
  },
  textField: {
    margin: theme.spacing(1, 1),
  },
  errorMessage: {
    margin: theme.spacing(1, 1),
    color: 'red'
  }
}))


export default function Report(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState('badImagery')
  const [text, setText] = React.useState()
  const [errorMessage, setErrorMessage] = React.useState('')

  function handleChange(event) {
    setValue(event.target.value)
  }

  function handleText(event) {
    setText(event.target.value)
  }

  function handleSubmit() {
    const validationResult = validateForm()
    if (validationResult) {
      props.onSubmit(value,text)
    }

  }

  function validateForm() {
    switch (value) {
      case 'other':
        if (!text) {
          setErrorMessage('Please enter a comment')
          return false
        }
        else {
          setErrorMessage('')
          return true
        }
      default:
        return true
    }
  }


  return (
      <div className={classes.paper}>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormLabel component='legend'><strong>What went wrong?</strong></FormLabel>
          <RadioGroup
              aria-label='report'
              name='reportingOptions'
              className={classes.group}
              value={value}
              onChange={handleChange}
          >
            <FormControlLabel key='badImagery' id='badImagery' value='badImagery' control={<Radio/>} label='Imagery issue' />
            { props.displayOtherOption &&
            <FormControlLabel key='other' id='other' value='other' control={<Radio id='other'/>} label='Other' />}
          </RadioGroup>
          { props.displayOtherOption &&
          <FormControlLabel
              value={text}
              control=
                  {<TextField
                      required
                      className={classes.textField}
                      label='Comment'
                      variant='outlined'
                      margin='normal'
                      id='commentInput'
                      multiline
                      inputProps={{maxLength: 140}}
                  />}
              onChange={handleText}
              disabled={value !== 'other'}
          />}

          <FormControlLabel value='error' control={<p className={classes.errorMessage}>{errorMessage}</p>} />
          <Button id='submitButton' variant='contained' color='primary' onClick={() => handleSubmit()}>
            Submit
          </Button>
        </FormControl>
      </div>
  )
}
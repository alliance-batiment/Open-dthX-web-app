import React, { useState } from "react";
import {
  Grid,
  Input,
  Select,
  MenuItem,
  Slider,
  RadioGroup,
  Radio,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";

function valuetext(value) {
  return `${value}`;
}

function isStaticProperty(property_type) {
  return property_type === "S";
}

function toBoolean(property_value) {
  if (property_value === "true" || property_value) {
    return true;
  } else {
    return false;
  }
}

function DefineTypeComponent(type, property, propertyIndex, configureProperty, selectorsRequest) {
  let component = null;
  let inputValueSlider = selectorsRequest?.find(item => item.id == property.property_id)?.value;

  if(inputValueSlider){
    property.num_value = inputValueSlider;
  }
    
  switch (type) {
    case "Réel":
      component = (
        <Input
          type="number"
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Entier":
      component = (
        <Input
          type="number"
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Date":
      component = (
        <Input
          type="date"
          name="text_value"
          format="DD/MM/YYYY"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Lien":
    case "Texte":
    case "Texte paramétrique":
      component = (
        <Input
          type="text"
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        />
      );
      break;
    case "Liste":
      component = (
        <Select
          name="text_value"
          fullWidth
          value={property.text_value}
          disabled={isStaticProperty(property.property_type)}
          onChange={configureProperty(propertyIndex)}
        >
          {property.list_value.map((value, index) => (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      );
      break;
    case "Grid/Tableau":
      const { values } = JSON.parse(property.text_value)
      console.log('VALUES', values)
      values.map((value) => {
        console.log('value', value)
      })
      component = (
        <TableContainer>
          <Table style={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {values.map((row, index) => (
                <TableRow
                  key={`row ${index}`}
                  style={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {row.map((cell, i) => (
                    <TableCell key={`cell ${index} ${i}`} component="th" scope="row">
                      {cell.data}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
      break;
    case "Booléen":
      component = (
        <RadioGroup
          name="text_value"
          value={`${property.text_value}`}
          onChange={configureProperty(propertyIndex)}
          row
        >
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="OUI"
            disabled={isStaticProperty(property.property_type)}
          />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="NON"
            disabled={isStaticProperty(property.property_type)}
          />
        </RadioGroup>
      );
      break;
    case "Intervalle":
      const marks = [
        {
          label: `${property.min_interval}`,
          value: property.min_interval,
        },
        {
          label: `${property.max_interval}`,
          value: property.max_interval,
        },
      ];
      component = (
        <Slider
          disabled={isStaticProperty(property.property_type)}
          name="num_value"
          onChange={configureProperty(propertyIndex, "num_value")}
          defaultValue={parseFloat(inputValueSlider)}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-custom"
          min={parseFloat(property.min_interval)}
          step={
            Math.pow(
              10,
              Math.floor(
                Math.log10(property.max_interval - property.min_interval)
              )
            ) * 0.1
          }
          value={property.num_value}
          max={parseFloat(property.max_interval)}
          marks={marks}
          valueLabelDisplay="auto"
        />
      );
      break;
    default:
      console.log(`Sorry, we are out of ${type}.`);
  }

  return component;
}

export default DefineTypeComponent;

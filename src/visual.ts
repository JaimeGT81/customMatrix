"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import DataViewCategorical = powerbi.DataViewCategorical;
import DataViewValueColumns = powerbi.DataViewValueColumns;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private container: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.container = document.createElement("div");
        this.container.className = "customMatrixContainer";
        options.element.appendChild(this.container)
    }

    public update(options: VisualUpdateOptions) {
        this.container.innerHTML = '';

        const dataView: DataView = options.dataViews[0];
        const categorical: DataViewCategorical = dataView.categorical;
        const valueColumns: DataViewValueColumns = categorical.values;

        const xDimension = categorical.categories[0].values;

        let tableHeaders = '<tr>';
        tableHeaders += '<th rowspan="2">Estado</th>';
        tableHeaders += `<th rowspan="2">${valueColumns[0].source.displayName}</th>`;
        tableHeaders += '<th colspan="3">Mercado</th>';
        tableHeaders += '<th colspan="3">Farmacias (FP)</th>';
        tableHeaders += '<th colspan="3">Independientes (IND)</th>';
        tableHeaders += '<th colspan="3">Resto Cadenas (RC)</th>';
        tableHeaders += '<th colspan="3">Market Share (MS)</th>';
        tableHeaders += '<th colspan="3">Crecimiento MS</th>';
        tableHeaders += '</tr>';

        tableHeaders += '<tr>';
        tableHeaders += '<th>Anterior</th>';
        tableHeaders += '<th>Actual</th>';
        tableHeaders += '<th>Crec.</th>';
        tableHeaders += '<th>Anterior</th>';
        tableHeaders += '<th>Actual</th>';
        tableHeaders += '<th>Crec.</th>';
        tableHeaders += '<th>Anterior</th>';
        tableHeaders += '<th>Actual</th>';
        tableHeaders += '<th>Crec.</th>';
        tableHeaders += '<th>Anterior</th>';
        tableHeaders += '<th>Actual</th>';
        tableHeaders += '<th>Crec.</th>';
        tableHeaders += '<th>FP</th>';
        tableHeaders += '<th>IND</th>';
        tableHeaders += '<th>RC</th>';
        tableHeaders += '<th>FP</th>';
        tableHeaders += '<th>IND</th>';
        tableHeaders += '<th>RC</th>';
        tableHeaders += '</tr>';

        let tableRows = '';

        let totalA = 0; //Bricks / JQ6
        let totalB = 0; //Mercado Anterior
        let totalC = 0; //Mercado Actual
        let totalD = 0; //% Crecimiento
        let totalE = 0; //Farmacias Anterior
        let totalF = 0; //Farmacias Actual
        let totalG = 0; //% Crecimiento
        let totalH = 0; //Independientes Anterior
        let totalI = 0; //Independientes Actual
        let totalJ = 0; //% Crecimiento
        let totalK = 0; //Resto Cadenas Anterior
        let totalL = 0; //Resto Cadenas Actual
        let totalM = 0; //% Crecimiento
        let totalN = 0; //Market Shared FP
        let totalO = 0; //Market Share IND
        let totalP = 0; //Market Share RC
        let totalQ = 0; //Crecimiento MS FP
        let totalR = 0; //Crecimiento MS IND
        let totalS = 0; //Crecimiento MS RC

        const data = xDimension.map((v, i) => {
            return {
              dimension: String(v),
              aValue: valueColumns[0].values[i] as number, // Brick / JQ6
              bValue: valueColumns[1].values[i] as number, // Mercado Anterior
              cValue: valueColumns[2].values[i] as number, // Mercado Actual
              eValue: valueColumns[3].values[i] as number, // Farmacias Anterior
              fValue: valueColumns[4].values[i] as number, // Farmacias Actual
              hValue: valueColumns[5].values[i] as number, // Independientes Anterior
              iValue: valueColumns[6].values[i] as number, // Independientes Actual
              kValue: valueColumns[7].values[i] as number, // Resto Cadenas Anterior
              lValue: valueColumns[8].values[i] as number, // Resto Cadenas Actual
            };
        });

        data.sort((a, b) => {
            if (a.dimension < b.dimension) return -1;
            if (a.dimension > b.dimension) return 1;
            return 0;
        });

        for (let i = 0; i < data.length; i++) {
            let row = `<tr><td class="rh">${data[i].dimension}</td>`;
          
            let aValue = data[i].aValue;
            let bValue = data[i].bValue / 1000000;
            let cValue = data[i].cValue / 1000000;
            let dValue = ((cValue / bValue) - 1)*100;
            let eValue = data[i].eValue / 1000000;
            let fValue = data[i].fValue / 1000000;
            let gValue = ((fValue / eValue) - 1)*100;
            let hValue = data[i].hValue / 1000000;
            let iValue = data[i].iValue / 1000000;
            let jValue = ((iValue / hValue) - 1)*100;
            let kValue = data[i].kValue / 1000000;
            let lValue = data[i].lValue / 1000000;
            let mValue = ((lValue / kValue) - 1)*100;
            let nValue = (fValue / cValue) * 100;
            let oValue = (iValue / cValue) * 100;
            let pValue = (lValue / cValue) * 100;
            let qValue = nValue - ((eValue / bValue) * 100);
            let rValue = oValue - ((hValue / bValue) * 100);
            let sValue = pValue - ((kValue / bValue) * 100);
          
            totalA += aValue;
            totalB += bValue;
            totalC += cValue;
            totalE += eValue;
            totalF += fValue;
            totalH += hValue;
            totalI += iValue;
            totalK += kValue;
            totalL += lValue;

            row += `<td>${Number(aValue.toFixed(0)).toLocaleString()}</td>`;
            row += `<td>${Number(bValue.toFixed(1)).toLocaleString()} mill.</td>`;
            row += `<td>${Number(cValue.toFixed(1)).toLocaleString()} mill.</td>`;
            row += `<td class="${dValue > 0 ? 'good' : 'bad'}">${dValue.toFixed(1)} %</td>`;
            row += gValue ? `<td>${Number(eValue.toFixed(1)).toLocaleString()} mill.</td>` : `<td></td>`;
            row += gValue ?  `<td>${Number(fValue.toFixed(1)).toLocaleString()} mill.</td>` : `<td></td>`;
            row += gValue ? `<td class="${gValue > 0 ? 'good' : 'bad'}">${gValue.toFixed(1)} %</td>` : `<td></td>`;
            row += `<td>${Number(hValue.toFixed(1)).toLocaleString()} mill.</td>`;
            row += `<td>${Number(iValue.toFixed(1)).toLocaleString()} mill.</td>`;
            row += `<td class="${jValue > 0 ? 'good' : 'bad'}">${jValue.toFixed(1)} %</td>`;
            row += `<td>${Number(kValue.toFixed(1)).toLocaleString()} mill.</td>`;
            row += `<td>${Number(lValue.toFixed(1)).toLocaleString()} mill.</td>`;
            row += `<td class="${mValue > 0 ? 'good' : 'bad'}">${mValue.toFixed(1)} %</td>`;
            row += gValue ? `<td>${nValue.toFixed(1)} %</td>` : `<td></td>`;
            row += `<td>${oValue.toFixed(1)} %</td>`;
            row += `<td>${pValue.toFixed(1)} %</td>`;
            row += gValue ? `<td class="${qValue > 0 ? 'good' : 'bad'}">${qValue.toFixed(1)} %</td>` : `<td></td>`;
            row += `<td class="${rValue > 0 ? 'good' : 'bad'}">${rValue.toFixed(1)} %</td>`;
            row += `<td class="${sValue > 0 ? 'good' : 'bad'}">${sValue.toFixed(1)} %</td>`;
          
            row += '</tr>';
            tableRows += row;
        }

        totalD = ((totalC / totalB) - 1)*100;
        totalG = ((totalF / totalE) - 1)*100;
        totalJ = ((totalI / totalH) - 1)*100;
        totalM = ((totalL / totalK) - 1)*100;
        totalN = (totalF / totalC) * 100;
        totalO = (totalI / totalC) * 100;
        totalP = (totalL / totalC) * 100;
        totalQ = totalN - ((totalE / totalB) * 100);
        totalR = totalO - ((totalH / totalB) * 100);
        totalS = totalP - ((totalK / totalB) * 100);

        let totalRow = `<tr class="totalRow">
                            <td style="text-align: center">Total</td>
                            <td>${Number(totalA.toFixed(0)).toLocaleString()}</td>
                            <td>${Number(totalB.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${Number(totalC.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${totalD.toFixed(1)} %</td>
                            <td>${Number(totalE.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${Number(totalF.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${totalG.toFixed(1)} %</td>
                            <td>${Number(totalH.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${Number(totalI.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${totalJ.toFixed(1)} %</td>
                            <td>${Number(totalK.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${Number(totalL.toFixed(1)).toLocaleString()} mill.</td>
                            <td>${totalM.toFixed(1)} %</td>
                            <td>${totalN.toFixed(1)} %</td>
                            <td>${totalO.toFixed(1)} %</td>
                            <td>${totalP.toFixed(1)} %</td>
                            <td>${totalQ.toFixed(1)} %</td>
                            <td>${totalR.toFixed(1)} %</td>
                            <td>${totalS.toFixed(1)} %</td>
                        </tr>`;
        tableRows += totalRow;

        const tableHtml = `
            <table class="customMatrix">
                <thead>
                ${tableHeaders}
                </thead>
                <tbody>
                ${tableRows}
                </tbody>
            </table>
        `;

        this.container.innerHTML = tableHtml;
    }
}

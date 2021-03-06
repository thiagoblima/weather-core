/**
 * @author: <thitheguy@gmail.com> Thiago Lima
 * @class: Forecast
 * @version: 0.1.0
 * @description: Forecast IO API
 */

import { BuildDev } from '../environments/build.dev';
import { LoggerService } from '../logger';
import { ForecastModel } from '../models/forecast.model';
import * as axios from 'axios';

export class Forecast implements ForecastModel {
    public buildDev;
    public loggerService;
    constructor({ ...attr }) {
        this.buildDev = new BuildDev({ ...attr });
        this.loggerService = new LoggerService({ ...attr });
    }

    async getWeather(response): Promise<JSON> {
        const weatherUrl = `${this.buildDev.apikeys.forecastIOURL + this.buildDev.apikeys.forecastIOKey}/${response.lat},${response.lng}`;

        try {
            await axios.get(weatherUrl).then(async (response) => {
                const temperature = response.data.currently.temperature;
                const apparentTemperature = response.data.currently.apparentTemperature;
                return await this.loggerService.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.`, { temperature: temperature, apparentTemperature: apparentTemperature });

            }).catch((error) => {
                if (error.code === 'ENOTFOUND') {
                    return this.loggerService.error('Unable to connect to API servers.', error);
                } else {
                    return this.loggerService.error(error.message);
                }
            });
        } catch (error) {
            return this.loggerService.error('An error occured:', error.message);

        }
        return await response;
    }
}

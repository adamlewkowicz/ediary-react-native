import { FriscoApi } from '../FriscoApi';
import { IlewazyApi } from '../IlewazyApi';

export class ProductSearchApi {
  
  private friscoApi = new FriscoApi();
  private ilewazyApi = new IlewazyApi();

  findByBarcode = this.friscoApi.findByBarcode.bind(this.friscoApi);
  findByName = this.ilewazyApi.findByName.bind(this.ilewazyApi);

}
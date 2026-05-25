import { Location } from 'src/bussiness/value-objects/location.value-object';
import {
  editLongitudeInput,
  editLatitudeInput,
  emptyInput,
  originalLongitude,
  originalLatitude,
} from './data/location.entity.spec.data';

describe('Location', () => {
  let location: Location;

  beforeEach(() => {
    location = new Location([originalLongitude, originalLatitude]);
  });

  describe('Edit', () => {
    describe('Longitude', () => {
      describe('Is present', () => {
        it('should change longitude', () => {
          location.edit(editLongitudeInput);
          expect(location.longitude).toEqual(editLongitudeInput.longitude);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change longitude", () => {
          location.edit(emptyInput);
          expect(location.longitude).toEqual(originalLongitude);
        });
      });
    });

    describe('Latitude', () => {
      describe('Is present', () => {
        it('should change latitude', () => {
          location.edit(editLatitudeInput);
          expect(location.latitude).toEqual(editLatitudeInput.latitude);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change latitude", () => {
          location.edit(emptyInput);
          expect(location.latitude).toEqual(originalLatitude);
        });
      });
    });
  });
});

import { Location } from 'src/bussiness/value-objects/location.value-object';
import {
  editSensorModelInput,
  editNameInput,
  editLocationInput,
  emptyInput,
  originalId,
  originalName,
  originalSensorModel,
  originalOwner,
  originalState,
  editOwnerInput,
  editStateInput,
} from './data/station.entity.spec.data';
import { Station } from 'src/bussiness/entities/station.entity';
import { mock } from 'test/resources/mocks/mock';

describe('Station', () => {
  let station: Station;
  let originalLocation: jest.Mocked<Location>;

  beforeEach(() => {
    originalLocation = mock(Location);
    station = new Station(
      originalId,
      originalName,
      originalLocation,
      originalSensorModel,
      originalOwner,
      originalState,
    );
  });

  describe('Edit', () => {
    describe('Name', () => {
      describe('Is present', () => {
        it('should change name', () => {
          station.edit(editNameInput);
          expect(station.name).toEqual(editNameInput.name);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change name", () => {
          station.edit(emptyInput);
          expect(station.name).toEqual(originalName);
        });
      });
    });

    describe('Location', () => {
      describe('Is present', () => {
        it('should edit location', () => {
          station.edit(editLocationInput);
          expect(originalLocation.edit).toHaveBeenCalledWith(editLocationInput.location);
        });
      });

      describe('Is not present', () => {
        it("shouldn't edit location", () => {
          station.edit(emptyInput);
          expect(originalLocation.edit).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('Owner', () => {
      describe('Is present', () => {
        it('should change owner id', () => {
          station.edit(editOwnerInput);
          expect(station.owner).toMatchObject(editOwnerInput.owner as any);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change owner id", () => {
          station.edit(emptyInput);
          expect(station.owner).toEqual(originalOwner);
        });
      });
    });

    describe('SensorModel', () => {
      describe('Is present', () => {
        it('should change sensor model', () => {
          station.edit(editSensorModelInput);
          expect(station.sensorModel).toEqual(editSensorModelInput.sensorModel);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change sensor model", () => {
          station.edit(emptyInput);
          expect(station.sensorModel).toEqual(originalSensorModel);
        });
      });
    });

    describe('State', () => {
      describe('Is present', () => {
        it('should change state', () => {
          station.edit(editStateInput);
          expect(station.state).toEqual(editStateInput.state);
        });
      });

      describe('Is not present', () => {
        it("shouldn't change state", () => {
          station.edit(emptyInput);
          expect(station.state).toEqual(originalState);
        });
      });
    });
  });

  afterEach(() => jest.restoreAllMocks());
});

import { expect } from 'chai';
import Tile from '@/store/tile';

describe('Create Tile instance', () => {
  it('should create correctly by specified value', () => {
    const tile = new Tile(0, 1, 2);
    expect(tile).to.have.property('x', 0);
    expect(tile).to.have.property('y', 1);
    expect(tile).to.have.property('value', 2);
    expect(tile).to.have.property('previousPosition', null);
    expect(tile).to.have.property('merged', false);
  });
});

describe('Call Tile update method', () => {
  it('should be update current and previous position', () => {
    const tile = new Tile(0, 1, 2);
    tile.update(2, 3);
    expect(tile).to.have.property('x', 2);
    expect(tile).to.have.property('y', 3);
    expect(tile.previousPosition).to.have.property('x', 0);
    expect(tile.previousPosition).to.have.property('y', 1);

    expect(tile).to.have.property('value', 2);
    expect(tile).to.have.property('merged', false);
  });
});

describe('Call Tile merge method', () => {
  it('should be update value and merged flag', () => {
    const tile = new Tile(0, 1, 2);
    tile.merge();
    expect(tile).to.have.property('value', 4);
    expect(tile).to.have.property('merged', true);

    expect(tile).to.have.property('x', 0);
    expect(tile).to.have.property('y', 1);
    expect(tile).to.have.property('previousPosition', null);
  });
});
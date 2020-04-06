import { expect } from 'chai';
import Tile from '@/store/tile';

describe('Create Tile instance', () => {
  it('should create correctly by specified value', () => {
    const tile = new Tile(0, 1, 2);
    expect(tile).to.have.property('x', 0);
    expect(tile).to.have.property('y', 1);
    expect(tile).to.have.property('value', 2);
    expect(tile).to.have.property('previous', null);
    expect(tile).to.have.property('merged', false);
  });
});

describe('Call Tile update method', () => {
  it('should be update current and previous position', () => {
    const tile = new Tile(0, 1, 2);
    tile.update(2, 3);
    expect(tile).to.have.property('x', 2);
    expect(tile).to.have.property('y', 3);
    expect(tile.previous).to.have.property('x', 0);
    expect(tile.previous).to.have.property('y', 1);

    expect(tile).to.have.property('value', 2);
    expect(tile).to.have.property('merged', false);
  });
});

describe('Call Tile merge method', () => {
  it('should be update value and merged flag', () => {
    const tile1 = new Tile(0, 1, 2);
    const tile2 = new Tile(0, 2, 2);
    tile1.merge(tile2);
    expect(tile1).to.have.property('value', 4);
    expect(tile1).to.have.property('merged', true);
    expect(tile1).to.have.deep.property('previous', { x: 0, y: 2 });
  });
});

describe('Call Tile clearMerged method', () => {
  it('should be clear merged flag', () => {
    const tile1 = new Tile(0, 1, 2);
    const tile2 = new Tile(0, 2, 2);
    tile1.clearMerged();
    expect(tile1).to.have.property('merged', false);

    tile1.merge(tile2);
    tile1.clearMerged();
    expect(tile1).to.have.property('merged', false);
  });
});

describe('Call Tile canMerge method', () => {
  it('can merge if it has same value and has not been merged yet', () => {
    const tile1 = new Tile(0, 1, 2);
    const tile2 = new Tile(0, 2, 2);
    expect(tile1.canMerge(tile2)).to.be.true;
  });
  it('can not merge if it has same value but has already been merged', () => {
    const tile1 = new Tile(0, 1, 2);
    const tile2 = new Tile(0, 2, 2);
    tile1.merge(tile2);
    expect(tile1.canMerge(tile2)).to.be.false;
  });
  it('can not merge if it has not same value', () => {
    const tile1 = new Tile(0, 1, 2);
    const tile2 = new Tile(0, 2, 4);
    expect(tile1.canMerge(tile2)).to.be.false;
  });
});

/* eslint-env mocha */
import React, { Component } from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import axios from 'axios';
import { mockAxios } from './setup';
import waitForExpect from 'wait-for-expect';

class SimpleComp extends Component {
  constructor() {
    super();
    this.state = {
      laptop: ''
    };
    this.fetchLaptopBrands = this.fetchLaptopBrands.bind(this);
    // console.log('CONSTRUCTOR');
  }

  componentDidMount() {
    // console.log('COMPONENT DID MOUNT');
    this.fetchLaptopBrands();
  }

  async fetchLaptopBrands() {
    const { laptopId } = this.props;
    const { data } = await axios.get(`/api/laptops/${laptopId}`);
    console.log('DATA --- ', data);
    this.setState({ laptop: data.laptop });
  }

  render() {
    // console.log('RENDER');
    const { laptop } = this.state;
    return (
      <div>
        <h1>Hello, World!</h1>
        <h3>My Laptop is a {laptop}</h3>
      </div>
    );
  }
}

// = props => (
//   <div>
//     <h1>Hello, World!</h1>
//     <h3>My Laptop is a {props.laptop}</h3>
//   </div>
// );

describe.only('React', () => {
  afterEach(() => {
    console.log('RESTORING MOCK AXIOS');
    mockAxios.restore();
  });

  it('renders component from props', async () => {
    mockAxios.onGet('/api/laptops/1').reply(200, {
      laptop: 'Apple'
    });

    const laptopId = 1;
    const myComponent = mount(<SimpleComp laptopId={laptopId} />);

    await waitForExpect(() => {
      console.log('waiting....');
      expect(myComponent.html()).to.include('Hello');
      expect(myComponent.html()).to.include('Apple');
      expect(myComponent.html()).to.not.include('Windows');
    });

    // more test
  });

  it('ACTUALLY renders component from props', async () => {
    mockAxios.onGet('/api/laptops/2').reply(200, {
      laptop: 'Windows'
    });
    const laptopId = 2;
    const myComponent = mount(<SimpleComp laptopId={laptopId} />);
    await waitForExpect(() => {
      expect(myComponent.html()).to.include('Hello');
      expect(myComponent.html()).to.include('Windows');
      expect(myComponent.html()).to.not.include('Apple');
    });
  });
});

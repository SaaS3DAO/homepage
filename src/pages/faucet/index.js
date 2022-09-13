import { Button, Input, message } from 'antd';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BgColorsOutlined } from '@ant-design/icons';
import { isValidETHAddress } from '@/utils/check';
import './index.less';
import BaseLayout from '@/components/comm/layout/BaseLayout';
import axios from 'axios';

export default function Faucet(params) {
  const search = decodeURI(new URLSearchParams(useLocation().search).get('code') || '');
  const [loginStatus, setLoginStatus] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [validAddressText, setValidaAddress] = useState('Please input your address');

  const GithubLogin = () => {
    const authorize_uri = 'https://github.com/login/oauth/authorize';
    const client_id = '72a17290c572de6117e4';
    const redirect_url = 'https://rpc.saas3.io:3000/faucet';
    window.location.href = `${authorize_uri}?client_id=${client_id}&redirect_url=${redirect_url}`;
  };

  const Submit = () => {
    if (!address.length) {
      message.error('please input your address');
      return;
    }
    fetch(`https://rpc.saas3.io:3101/saas3/airdrop/faucet?address=${address}`, {
      method: 'GET'
    }).then((response) => {
      if (response.status === 200) {
        message.success('100 test tokens will be sent to your address');
        return response.json();
      } else {
        message.error('pending, please wait.');
      }
    });
  };
  const checkAddress = (address) => {
    if (!address) {
      return setValidaAddress('Please input your address');
    }
    const valid = isValidETHAddress(address);
    setValidaAddress(!valid ? 'Address verification failed' : '');
  };

  React.useEffect(() => {
    if (search.length) {
      setLoginStatus(true);
    }
  }, [search]);

  return (
    <BaseLayout className='faucet'>
      <div className='text-center text-white faucet-main container'>
        <BgColorsOutlined style={{ fontSize: '180px' }} />
        <div className='mt-32px'>
          <Input
            placeholder={
              loginStatus ? 'Paste Your ERC20 Address' : 'Please Click GitHub Login Button'
            }
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            onBlur={(e) => checkAddress(e.target.value)}
            disabled={!loginStatus}
            size='large'
          ></Input>
          {loginStatus && <p className='error-text'>{validAddressText}</p>}
          <Button
            className='submit-button'
            type='primary'
            disabled={loginStatus ? !!validAddressText : false}
            onClick={() => {
              if (loginStatus === false) GithubLogin();
              else Submit();
            }}
          >
            {loginStatus ? 'Submit' : 'Login Github'}
          </Button>
        </div>
      </div>
    </BaseLayout>
  );
}

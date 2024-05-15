import { useState, useEffect } from 'preact/hooks';
import {queryCurrentLoginAccount} from '../../../ts/api/account'

const Username = () => {
  const [value, setValue] = useState(null);

  useEffect(async () => {
    let account = await queryCurrentLoginAccount()
    setValue(account.username);
  }, []);

  return (
    <span>
      {value}
    </span>
  );
};

export default Username;

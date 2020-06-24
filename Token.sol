pragma solidity ^0.4.11;
contract PoCoin{
    address owner;
    string name;
    string symbol;
    uint256 totalPoCoins;

    mapping (address=>uint256)public balance;

    function poCoin(string memory _name, string memory _symbol, uint256 _totalPoCoins) public{
        owner=msg.sender;
        name=_name;
        symbol=_symbol;
        totalPoCoins=_totalPoCoins;
        balance[owner]=totalPoCoins;
    }


    function totalSupply() public returns(uint256){
        //see the total supply of PoCoins
        return totalPoCoins;
    }

    function balanceOf(address _owner)public returns (uint256){
        //how much own.
        return balance[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool){
        //transfer. check whether sender has enough coins before send.
        require(balance[msg.sender]>_value);
        address _from = msg.sender;
        owner=_to;
        //emit Transfer(_from, _to, _value);
        _to.transfer(_value);
        balance[_from] = balance[_from] - _value;
        balance[_to] = balance[_to] + _value;
        return true;
    }
}
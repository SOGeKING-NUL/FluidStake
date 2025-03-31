// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IERC20 {
    function allowance(address owner, address spender) external view returns (uint256);
}

interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function getReservesList() external view returns (address[] memory);
}

interface IPoolAddressesProvider {
    function getPool() external view returns (address);
}

contract WETHStaker {
    // Sepolia testnet addresses
    address public constant ADDRESSES_PROVIDER = 0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A;
    address public constant WETH_ADDRESS = 0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c;
    
    event PoolVerified(bool isValid);
    event DepositSuccessful(address indexed user, uint256 amount);
    
    
    function getPoolAddress() public view returns (address) {
        return IPoolAddressesProvider(ADDRESSES_PROVIDER).getPool();
    }
    
    function checkAllowance(address user) external view returns (uint256) {
        address pool = getPoolAddress();
        return IERC20(WETH_ADDRESS).allowance(user, pool);
    }
    

    function isPoolValid() external returns (bool isValid) {
        try this.checkReserveExists() {
            emit PoolVerified(true);
            return true;
        } catch {
            emit PoolVerified(false);
            return false;
        }
    }
    
    function checkReserveExists() external view returns (bool) {
        address pool = getPoolAddress();
        address[] memory reserves = IPool(pool).getReservesList();
        for (uint i = 0; i < reserves.length; i++) {
            if (reserves[i] == WETH_ADDRESS) return true;
        }
        return false;
    }
    
   
    function supplyWETH(uint256 weiAmount) external {
        require(weiAmount != 0, "Amount cannot be zero");
        require(this.isPoolValid(), "Invalid Pool address");
        
        address pool = getPoolAddress();
        IPool(pool).supply(WETH_ADDRESS, weiAmount, msg.sender, 0);
        
        emit DepositSuccessful(msg.sender, weiAmount);
    }
}

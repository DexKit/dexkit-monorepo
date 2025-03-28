export const ERC165Abi = [
  "function supportsInterface(bytes4 interfaceId) public view returns (bool)",
];

export const ERC721Abi = [
  "function name() external view returns (string _name)",
  "function symbol() external view returns (string _symbol)",
  "function ownerOf(uint256 _tokenId) view returns (address)",
  "function tokenURI(uint256 _tokenId) view returns (string)",
  "function totalSupply() external view returns (uint256)",
];

export const ERC1155Abi = [
  "function name() external view returns (string _name)",
  "function symbol() external view returns (string _symbol)",
  "function uri(uint256 _tokenId) view returns (string)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data) external"
];

export const ERC20Abi = [
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function decimals() public view returns (uint8)",
  "function totalSupply() public view returns (uint256)",
  "function balanceOf(address _owner) public view returns (uint256 balance)",
  "function transfer(address _to, uint256 _value) public returns (bool success)",
  "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
  "event Transfer(address indexed _from, address indexed _to, uint256 _value)",
  "event Approval(address indexed _owner, address indexed _spender, uint256 _value)",
];

export const WETHAbi = [
  ...ERC20Abi,
  "function deposit() public payable",
  "function withdraw(uint wad) public",
];

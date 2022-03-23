// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract smartContract is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    string public notRevealedUri;
    uint256 public PreSaleCost = .1 ether;
    uint256 public cost = .2 ether;
    uint256 public PreSaleMaxSupply = 3000;
    uint256 public maxSupply = 10000;
    uint256 public PreSaleMaxMintAmount = 1;
    uint256 public MaxMintAmount = 10;
    uint256 public PreSaleNFTPerAddressLimit = 1;
    uint256 public NFTPerAddressLimit = 15;
    bool public paused = false;
    bool public revealed = false;
    bool public onlyWhitelisted = true;
    address[] public whitelistedAddresses;
    mapping(address => uint256) public addressMintedBalance;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        string memory _initNotRevealedUri
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        setNotRevealedURI(_initNotRevealedUri);
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // public
    function mint(uint256 _mintAmount) public payable {
        require(!paused, "the contract is paused");
        uint256 supply = totalSupply();
        require(_mintAmount > 0, "need to mint at least 1 NFT");

        if (msg.sender != owner()) {
            if (onlyWhitelisted == true) {
                require(isWhitelisted(msg.sender), "user is not whitelisted");
                require(
                    _mintAmount <= PreSaleMaxMintAmount,
                    "max mint amount per transaction exceeded"
                );
                uint256 ownerMintedCount = addressMintedBalance[msg.sender];
                require(
                    ownerMintedCount + _mintAmount <= PreSaleNFTPerAddressLimit,
                    "max Presale NFT per address exceeded"
                );
                require(
                    msg.value >= PreSaleCost * _mintAmount,
                    "insufficient funds"
                );
                require(
                    supply + _mintAmount <= PreSaleMaxSupply,
                    "max NFT presale limit exceeded"
                );
            }
            if (onlyWhitelisted == false) {
                require(
                    _mintAmount <= MaxMintAmount,
                    "max mint amount per session exceeded"
                );
                require(
                    supply + _mintAmount <= maxSupply,
                    "max NFT limit exceeded"
                );
                uint256 ownerMintedCount = addressMintedBalance[msg.sender];
                require(
                    ownerMintedCount + _mintAmount <= NFTPerAddressLimit,
                    "max NFT per address exceeded"
                );
                require(msg.value >= cost * _mintAmount, "insufficient funds");
            }
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            addressMintedBalance[msg.sender]++;
            _safeMint(msg.sender, supply + i);
        }
    }

    function isWhitelisted(address _user) public view returns (bool) {
        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (revealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    //only owner
    function reveal() public onlyOwner {
        revealed = true;
    }

    function SetPreSaleMaxSupply(uint256 _newPreSaleMaxSupply)
        public
        onlyOwner
    {
        PreSaleMaxSupply = _newPreSaleMaxSupply;
    }

    function setPreSaleNFTPerAddressLimit(uint256 _PreSaleNFTPerAddressLimit)
        public
        onlyOwner
    {
        PreSaleNFTPerAddressLimit = _PreSaleNFTPerAddressLimit;
    }

    function setNFTPerAddressLimit(uint256 _limit) public onlyOwner {
        NFTPerAddressLimit = _limit;
    }

    function setPreSaleCost(uint256 _newPreSaleCost) public onlyOwner {
        PreSaleCost = _newPreSaleCost;
    }

    function SetCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setPreSaleMaxMintAmount(uint256 _newPreSaleMaxMintAmount)
        public
        onlyOwner
    {
        PreSaleMaxMintAmount = _newPreSaleMaxMintAmount;
    }

    function setMaxMintAmount(uint256 _newMaxMintAmount) public onlyOwner {
        MaxMintAmount = _newMaxMintAmount;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function setOnlyWhitelisted(bool _state) public onlyOwner {
        onlyWhitelisted = _state;
    }

    function whitelistUsers(address[] calldata _users) public onlyOwner {
        delete whitelistedAddresses;
        whitelistedAddresses = _users;
    }

    function withdraw() public payable onlyOwner {
        (bool os, ) = payable(owner()).call{value: address(this).balance}("");
        require(os);
    }
}

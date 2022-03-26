//SPDX-License-Identifier: Unlicense
pragma solidity =0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./RandomlyAssigned.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract UMC is ERC721, Ownable, RandomlyAssigned {
    using Strings for uint256;
    uint256 public MAX_UMC;
    string public baseURI;
    bool public revealed;
    string public notRevealedUri;
    address public artist = 0xc1Dd67C9061229c7D09567Fc2EfBC1098fCbddCB;
    address public team = 0x947Ad816a09898c8B8E56b817835262E88117113;
    address public company = 0xf8F37A75dc69F8DAC555C9a86167E23Fb74E5dcf;
    address public receiver = 0x947Ad816a09898c8B8E56b817835262E88117113;

    uint8 public feePrc = 10; //10%
    uint8 public artistPrc = 25;
    uint8 public teamPrc = 55;
    uint8 public companyPrc = 20;

    mapping(Status => mapping(address => uint8)) public tokens;
    mapping(Status => Round) public rounds;

    event UMCMinted(address _minter, uint256 tokenId);
    enum Status {
        PRIVATE,
        PUBLIC
    }

    struct Round {
        Status name;
        uint256 beginAt;
        uint256 finishAt;
        uint256 price;
        uint256 maxItems;
        uint8 limitPerUser;
        uint8 limitPerTx;
    }

    modifier verify(Status _round, uint256 _amount) {
        require(
            rounds[_round].beginAt <= block.timestamp &&
                rounds[_round].finishAt >= block.timestamp,
            "Invalid Round"
        );
        require(rounds[_round].maxItems - _amount >= 0, "Amount Exceeded");
        require(
            tokens[_round][msg.sender] + _amount <= rounds[_round].limitPerUser,
            "Limit Amount Per User"
        );
        require(_amount <= rounds[_round].limitPerTx, "Limit Amount Per Tx");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        string memory _notRevealedUri,
        uint256 _maxSupply
    ) ERC721(_name, _symbol) RandomlyAssigned(_maxSupply, 1) {
        MAX_UMC = _maxSupply;
        setBaseURI(_baseURI);
        setNotRevealedURI(_notRevealedUri);
        for (uint8 i = 1; i <= 50; i++) {
            uint256 id = nextToken();
            _safeMint(receiver, id);
            emit UMCMinted(receiver, id);
        }
        rounds[Status.PRIVATE] = Round(
            Status.PRIVATE,
            1648234800,
            1648234800 + 1 days,
            0.1 * 10**18,
            888,
            1,
            1
        );
        rounds[Status.PUBLIC] = Round(
            Status.PUBLIC,
            1648324800,
            1648324800 + 2 days,
            0.18 * 10**18,
            8000,
            100,
            10
        );
    }

    /**
     * @dev Withdraw ether from this contract (Callable by owner only)
     */
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    //only owner
    function reveal(bool _state) public onlyOwner {
        revealed = _state;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function buy(Status _round, uint8 _amount)
        public
        payable
        verify(_round, _amount)
    {
        uint256 price = rounds[_round].price * _amount;
        require(msg.value == price, "Insuffisant Amount");
        uint256 feeAmount = (msg.value * feePrc) / 100;
        require(payable(artist).send((feeAmount * artistPrc) / 100));
        require(payable(team).send((feeAmount * teamPrc) / 100));
        require(payable(company).send((feeAmount * companyPrc) / 100));
        tokens[_round][msg.sender] += _amount;
        rounds[_round].maxItems -= _amount;
        for (uint256 i = 1; i <= _amount; i++) {
            uint256 id = nextToken();
            _safeMint(msg.sender, id);
            emit UMCMinted(msg.sender, id);
        }
    }

    function getActiveRound() public view returns (Status _round) {
        if (
            rounds[Status.PRIVATE].beginAt <= block.timestamp &&
            rounds[Status.PRIVATE].finishAt >= block.timestamp
        ) return Status.PRIVATE;
        if (
            rounds[Status.PUBLIC].beginAt <= block.timestamp &&
            rounds[Status.PUBLIC].finishAt >= block.timestamp
        ) return Status.PUBLIC;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(_exists(tokenId), "Cannot query non-existent token");

        if (revealed == false) {
            return notRevealedUri;
        }
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }
}

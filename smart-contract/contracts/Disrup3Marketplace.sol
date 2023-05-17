// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Permitir que nfts sean listados
// Cobrar un Fee de plataforma
// Cobrar un fee de colección ( opcional )
// permitir pagos en Token nativo y ERC20 ( whitelist )
// permitir listado de nfts 721
// permitir cancelar listing
// permitir comprar los nft en el marketplace

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

error NotListed(address nftAddress, uint256 tokenId);
error ItemAlreadyListed(address nftAddress, uint256 tokenId);
error NotNftOwner();
error InvalidNftPrice();
error NftNotApproved();
error TokenNotAllowed();
error InsufficientValue();

contract Disrup3Marketplace is Ownable {
    struct Listing {
        address payToken;
        uint256 price;
        address seller;
    }

    struct CollectionFeeInfo {
        uint fee;
        address receiver;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        address paytoken,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        address paytoken,
        uint256 price
    );

    bytes4 constant ERC2981_INTERFACEID = 0x2a55205a;
    uint256 constant BASE_FACTOR = 10_000;
    // 200 -> 2% 10000
    uint256 public MarketplaceFee = 200;
    address payable public Feerecipient;

    mapping(address => bool) public allowedTokens;
    mapping(address => CollectionFeeInfo) public collectionFees;
    // nftAddress -> tokenId -> Listing
    mapping(address => mapping(uint256 => Listing)) private listings;

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert ItemAlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier validToken(address _token) {
        if (!allowedTokens[_token]) {
            revert TokenNotAllowed();
        }
        _;
    }

    modifier isNftOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        address owner = IERC721(nftAddress).ownerOf(tokenId);
        if (spender != owner) {
            revert NotNftOwner();
        }
        _;
    }

    constructor() {
        Feerecipient = payable(msg.sender);
        allowedTokens[address(0)] = true;
    }

    function listItem(
        address nftAddress,
        address payToken,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId)
        isNftOwner(nftAddress, tokenId, msg.sender)
        validToken(payToken)
    {
        if (price <= 0) {
            revert InvalidNftPrice();
        }

        if (IERC721(nftAddress).getApproved(tokenId) != address(this)) {
            revert NftNotApproved();
        }

        listings[nftAddress][tokenId] = Listing(payToken, price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, payToken, price);
    }

    function cancelListing(
        address nftAddress,
        uint tokenId
    )
        external
        isNftOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete listings[nftAddress][tokenId];
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function buyItem(
        address nftAddress,
        uint tokenId
    ) external payable isListed(nftAddress, tokenId) {
        Listing memory listedItem = listings[nftAddress][tokenId];

        uint royaltyFee = (listedItem.price * MarketplaceFee) / BASE_FACTOR;
        uint collectionRoyalty = 0;
        address collectionFeeReceiver;

        if (IERC165(nftAddress).supportsInterface(ERC2981_INTERFACEID)) {
            (address receiver, uint amount) = IERC2981(nftAddress).royaltyInfo(
                tokenId,
                listedItem.price
            );
            collectionRoyalty = amount;
            collectionFeeReceiver = receiver;
        } else {
            if (collectionFees[nftAddress].fee > 0) {
                collectionRoyalty =
                    (listedItem.price * collectionFees[nftAddress].fee) /
                    BASE_FACTOR;
                collectionFeeReceiver = collectionFees[nftAddress].receiver;
            }
        }

        if (listedItem.payToken == address(0)) {
            // pago en token nativo ( msg.value )
            if (msg.value < listedItem.price) {
                revert InsufficientValue();
            }

            Feerecipient.transfer(royaltyFee);

            if (collectionFeeReceiver != address(0))
                payable(collectionFeeReceiver).transfer(collectionRoyalty);

            payable(listedItem.seller).transfer(
                listedItem.price - royaltyFee - collectionRoyalty
            );
        } else {
            // pago en erc20

            IERC20 token = IERC20(listedItem.payToken);
            if (collectionFeeReceiver != address(0))
                token.transferFrom(
                    msg.sender,
                    collectionFeeReceiver,
                    collectionRoyalty
                );

            token.transferFrom(msg.sender, Feerecipient, royaltyFee);

            token.transferFrom(
                msg.sender,
                listedItem.seller,
                listedItem.price - royaltyFee - collectionRoyalty
            );
        }

        delete listings[nftAddress][tokenId];

        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );

        emit ItemBought(
            msg.sender,
            nftAddress,
            tokenId,
            listedItem.payToken,
            listedItem.price
        );
    }

    // ADMIN FUNCTIONS

    function addPaytoken(address _newToken) external onlyOwner {
        allowedTokens[_newToken] = true;
    }
}
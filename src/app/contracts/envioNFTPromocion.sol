// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GatedNFT is ERC1155, Ownable {
    string public name = "NFT Promocion";
    string public baseImage = "ipfs://bafkreiezihzpp7vs3iwq6sn3yenczajmmevjmi7vekotttypdxxlwv2mya";
    uint256 public currentTokenId = 0;

    // Dirección del contrato externo (NFT_TPI)
    address public immutable nftTpiContract = 0x5127885a952117c92fFBed39646cEa40c9a93488;

    struct NFTMetadata {
        string nombre;
        string fecha;
        string descripcion;
    }

    mapping(uint256 => NFTMetadata) public metadatas;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mintNFT(
        string memory _nombre,
        string memory _fecha,
        string memory _descripcion
    ) public {
        // Validar si el minteador posee al menos un NFT del contrato TPI
        IERC1155 externalContract = IERC1155(nftTpiContract);
        bool isHolder = false;

        for (uint256 i = 1; i <= 10; i++) { // Asumiendo que los tokens posibles son del 1 al 10
            if (externalContract.balanceOf(msg.sender, i) > 0) {
                isHolder = true;
                break;
            }
        }

        require(isHolder, "No posees un NFT del contrato TPI");

        uint256 newTokenId = ++currentTokenId;

        metadatas[newTokenId] = NFTMetadata({
            nombre: _nombre,
            fecha: _fecha,
            descripcion: _descripcion
        });

        _mint(0xd614a872961aa8213283464afb00f9bfb938d7a1, newTokenId, 1, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(
            "ipfs://bafkreiezihzpp7vs3iwq6sn3yenczajmmevjmi7vekotttypdxxlwv2mya/", 
            _toString(tokenId), 
            ".json"
        ));
    }


    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC1155 is ERC1155, Ownable {
    string public name = "NFT TPI";
    string public baseImage = "ipfs://bafkreie4xkcq4w6fdde4fvmnw2hq7q2pitclw7ccnovdzr6oig4x2gomve";
    uint256 public currentTokenId = 0;

    struct NFTMetadata {
        string nombreAlumno;
        string fecha;
        address from;
        uint256[10] idsVerificados;
    }

    mapping(uint256 => NFTMetadata) public metadatas;

    // El destinatario fijo ahora es solo uno (tu wallet)
    address public destinatario = 0xd614A872961Aa8213283464aFb00F9bfB938d7a1;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mintNFT(
        string memory _nombreAlumno,
        string memory _fecha,
        uint256[10] memory _idsVerificados
    ) public {
        uint256 newTokenId = ++currentTokenId;

        metadatas[newTokenId] = NFTMetadata({
            nombreAlumno: _nombreAlumno,
            fecha: _fecha,
            from: msg.sender,
            idsVerificados: _idsVerificados
        });

        _mint(destinatario, newTokenId, 1, ""); // Solo minteamos a tu wallet
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(
            "ipfs://tpi-metadata/", 
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

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
        string idsVerificados;
    }

    mapping(uint256 => NFTMetadata) public metadatas;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function mintNFT(
        address _destinatario,
        string memory _nombreAlumno,
        string memory _fecha,
        string memory _idsVerificados
    ) public {
        uint256 newTokenId = ++currentTokenId;

        metadatas[newTokenId] = NFTMetadata({
            nombreAlumno: _nombreAlumno,
            fecha: _fecha,
            from: msg.sender,
            idsVerificados: _idsVerificados
        });

        _mint(_destinatario, newTokenId, 1, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(
            "ipfs://bafkreie4xkcq4w6fdde4fvmnw2hq7q2pitclw7ccnovdzr6oig4x2gomve/", 
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

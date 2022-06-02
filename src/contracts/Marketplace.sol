pragma solidity >=0.4.21 <=0.8.14;

contract Marketplace {
    string name;
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
    }
    mapping(uint256 => Product) public products;
    uint256 public productCount = 0;

    constructor() public {
        name = "Kushagra's MarketPlace";
    }

    function createProduct(string memory _name, uint256 _price) public {
        require(bytes(_name).length > 0);
        require(_price > 0);
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            (msg.sender),
            false
        );
    }

    function purhcaseProduct(uint256 _id) public payable {
        Product memory _product = products[_id];
        // Fetch the owner
        address payable _seller = _product.owner;
        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);
        // Require that the product has not been purchased already
        require(!_product.purchased);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        _product.owner = (msg.sender);
        // Mark as purchased
        _product.purchased = true;
        // Update the product
        products[_id] = _product;
        // Pay the seller by sending them Ether
        (_seller).transfer(_product.price);
    }
}

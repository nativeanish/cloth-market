use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::{env, near_bindgen, AccountId, Promise};

#[derive(BorshDeserialize, BorshSerialize)]
struct Clothe {
    name: String,
    image: String,
    price: u8,
    quantity: u8,
    vendor: AccountId,
}

impl Clothe {
    pub fn new(name: String, image: String, price: u8, quantity: u8, vendor: AccountId) -> Self {
        Self {
            name,
            image,
            price,
            quantity,
            vendor,
        }
    }
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Marketplace {
    item: UnorderedMap<u64, Clothe>,
    buyer: UnorderedMap<u64, Vector<AccountId>>,
}

#[near_bindgen]
impl Marketplace {
    pub fn addclothe(&mut self, name: String, image: String, price: String, quantity: String) {
        let index: u64 = self.item.len() + 1;
        self.item.insert(
            &index,
            &Clothe::new(
                name,
                image,
                price.parse::<u8>().unwrap(),
                quantity.parse::<u8>().unwrap(),
                env::signer_account_id(),
            ),
        );
    }

    pub fn getclothe(&self, id: String) -> (String, String, String, String, String, Vec<String>) {
        let index: u64 = id.parse::<u64>().unwrap();

        let clothe: Clothe = self.item.get(&index).unwrap();
        (
            clothe.name,
            clothe.image,
            clothe.price.to_string(),
            clothe.quantity.to_string(),
            clothe.vendor,
            self.buyer_list(id.parse::<u64>().unwrap()),
        )
    }

    #[private]
    fn buyer_list(&self, id: u64) -> Vec<String> {
        if let Some(i) = self.buyer.get(&id) {
            let mut k: Vec<String> = vec![];
            for g in i.iter() {
                k.push(g);
            }
            return k;
        }
        return Vec::<String>::new();
    }

    pub fn getclothes(&self) -> Vec<(String, String, String, String, String, Vec<String>)> {
        let mut dec: Vec<(String, String, String, String, String, Vec<String>)> = vec![];
        for g in 1..=self.item.len() {
            dec.push(self.getclothe(g.to_string()));
        }
        dec
    }

    #[payable]
    pub fn buy(&mut self, id: String) {
        let amount = "1".parse::<u128>().unwrap() * 10u128.pow(24);
        let dec = self.item.get(&id.parse::<u64>().unwrap()).unwrap();
        if (dec.price as u128) * amount <= (env::attached_deposit()) {
            let buyer_l = self.buyer_list(id.parse::<u64>().unwrap());
            if (buyer_l.len() + 1) as u8 > dec.quantity {
                env::panic(b"Stock is cleared Now");
            } else {
                Promise::new(dec.vendor).transfer(env::attached_deposit());
                let mut de: Vector<AccountId> = Vector::new(b'o');
                for g in buyer_l {
                    de.push(&g);
                }
                de.push(&env::signer_account_id());
                self.buyer.insert(&id.parse::<u64>().unwrap(), &de);
            }
        } else {
            env::panic(b"Amount was less");
        }
    }
}

impl Default for Marketplace {
    fn default() -> Self {
        Self {
            item: UnorderedMap::<u64, Clothe>::new(b'i'),
            buyer: UnorderedMap::<u64, Vector<AccountId>>::new(b'o'),
        }
    }
}

//Test
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};
    fn get_context(predecessor_account_id: String, storage_usage: u64) -> VMContext {
        VMContext {
            current_account_id: "marketplace.near".to_string(),
            signer_account_id: "anish.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id,
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: 200,
            account_locked_balance: 0,
            storage_usage,
            attached_deposit: 10,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn addingcloth() {
        let context = get_context("anish.testnet".to_string(), 0);
        testing_env!(context);
        let mut contract = Marketplace::default();
        contract.addclothe(
            "socks".to_string(),
            "image of socks".to_string(),
            "2".to_string(),
            "2".to_string(),
        );
        assert_eq!(
            contract.getclothe("1".to_string()),
            (
                "socks".to_string(),
                "image of socks".to_string(),
                "2".to_string(),
                "2".to_string(),
                "anish.testnet".to_string(),
                Vec::<String>::new()
            )
        )
    }
    #[test]
    fn gettingallcloth() {
        let context = get_context("anish.testnet".to_string(), 0);
        testing_env!(context);
        let mut contract = Marketplace::default();
        contract.addclothe(
            "socks".to_string(),
            "image of socks".to_string(),
            "2".to_string(),
            "2".to_string(),
        );
        contract.addclothe(
            "jeans".to_string(),
            "image of jeans".to_string(),
            "6".to_string(),
            "3".to_string(),
        );
        assert_eq!(
            contract.getclothes(),
            [
                (
                    "socks".to_string(),
                    "image of socks".to_string(),
                    "2".to_string(),
                    "2".to_string(),
                    "anish.testnet".to_string(),
                    Vec::<String>::new()
                ),
                (
                    "jeans".to_string(),
                    "image of jeans".to_string(),
                    "6".to_string(),
                    "3".to_string(),
                    "anish.testnet".to_string(),
                    Vec::<String>::new()
                )
            ]
        )
    }
}

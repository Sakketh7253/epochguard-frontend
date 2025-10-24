# EpochGuard Sample Datasets

This folder contains realistic blockchain node datasets for testing the EpochGuard security analysis system.

## Available Datasets:

### Balanced Datasets (Equal distribution of secure/malicious nodes)
- **dataset_balanced_100_100.csv** - 200 nodes (100 secure, 100 malicious)
- **dataset_balanced_400_400.csv** - 800 nodes (400 secure, 400 malicious)

### Imbalanced Datasets (Realistic network conditions)
- **dataset_imbalanced_150_50.csv** - 200 nodes (150 secure, 50 malicious)
- **dataset_imbalanced_50_150.csv** - 200 nodes (50 secure, 150 malicious)

### Large-scale Datasets (Enterprise simulation)
- **dataset_large_200_100.csv** - 300 nodes (200 secure, 100 malicious)
- **dataset_large_300_200.csv** - 500 nodes (300 secure, 200 malicious)

### Sample Dataset
- **sample-blockchain-data.csv** - 20 nodes (small test dataset)

## Data Format:
Each dataset contains the following features:
- `stake_amount` - Amount of cryptocurrency staked
- `coin_age` - Age of coins used for staking  
- `stake_distribution_rate` - Rate of stake distribution
- `block_generation_rate` - Rate of block generation
- `stake_reward` - Reward received from staking
- `node_latency` - Network latency of the node
- `downtime_percent` - Percentage of downtime
- `Node Label` - 0 = Secure node, 1 = Malicious node

## Usage:
1. Download any dataset from the frontend interface
2. Upload it to test the EpochGuard analysis system
3. View real-time security analysis results
4. Compare different dataset scenarios

The frontend will automatically detect the dataset type and provide accurate analysis results based on the actual data distribution.
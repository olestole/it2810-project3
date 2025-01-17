import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AppState, FilterOptions, ViewMode } from 'store/types';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from 'components/Shared/LoadingIndicator';
import { getProductType } from './ProductList/productTypes';
import {
  EnhancedTableHead,
  getComparator,
  HeaderData,
  Order,
  stableSort,
  useStyles,
} from './ProductList/EnhancedTableHead';
import { updateViewMode } from 'store/action';
import { PRODUCTS } from 'graphql/queries';
import { ProductsQuery } from 'graphql/__generated__/ProductsQuery';

const ProductListView = () => {
  const classes = useStyles();
  const history = useHistory();
  const [isFetching, setIsFetching] = useState<Boolean>(false);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof HeaderData>('Varenavn');
  const searchText: string = useSelector((state: AppState) => state.searchText);
  let filterOptions: FilterOptions = useSelector((state: AppState) => state.filterOptions);
  let viewMode: ViewMode = useSelector((state: AppState) => state.viewMode);
  const filterGlobalToArray = () => {
    let filteredArray: string[] = [];
    Object.keys(filterOptions.kategorier).map((key, index) => {
      if (filterOptions.kategorier[key]) {
        filteredArray = filteredArray.concat(getProductType(key));
      }
    });
    filteredArray = filteredArray.length === 0 ? getProductType('') : filteredArray;
    return filteredArray;
  };

  const { data, loading, error, fetchMore } = useQuery<ProductsQuery>(PRODUCTS, {
    variables: {
      matchedString: searchText,
      filterIndex: 0,
      typer: filterGlobalToArray(),
      prisgt: filterOptions.minPrice,
      prisls: filterOptions.maxPrice,
      volumgt: filterOptions.minVolum,
      volumls: filterOptions.maxVolum,
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  }, []);

  const handleProductClick = (productId: string) => {
    history.push(`/${productId}`);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof HeaderData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  let loadMore = () => {
    /*
    fetchMore basically allows you to do a new GraphQL query and merge the result into the original result.
    */
    if (viewMode.initialLoad) {
      dispatch(updateViewMode({ field: 'initialLoad', value: false }));
      fetchMore({
        variables: {
          matchedString: searchText,
          filterIndex: 0,
          typer: filterGlobalToArray(),
          prisgt: filterOptions.minPrice,
          prisls: filterOptions.maxPrice,
          volumgt: filterOptions.minVolum,
          volumls: filterOptions.maxVolum,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            products: [...fetchMoreResult.products],
          });
        },
      });
    } else {
      fetchMore({
        variables: {
          matchedString: searchText,
          filterIndex: data ? data.products.length : 0,
          typer: filterGlobalToArray(),
          prisgt: filterOptions.minPrice,
          prisls: filterOptions.maxPrice,
          volumgt: filterOptions.minVolum,
          volumls: filterOptions.maxVolum,
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            products: [...prev.products, ...fetchMoreResult.products],
          });
        },
      });
    }
  };

  const handleScroll = () => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !== document.documentElement.offsetHeight ||
      isFetching ||
      history.location.pathname !== '/'
    )
      return;
    dispatch(updateViewMode({ field: 'initialLoad', value: false }));
    setIsFetching(true);
  };

  useEffect(() => {
    if (!isFetching) return;

    loadMore();
    setIsFetching(false);
  }, [isFetching]);

  useEffect(() => {
    if (searchText === '' || !viewMode.initialLoad) {
      return;
    }
    loadMore();
  }, [searchText, filterOptions]);

  if (loading) return <LoadingIndicator />;

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className={classes.list}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" aria-label="enhanced table">
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data ? data.products.length : 0}
            />
            <TableBody>
              {data &&
                stableSort(data.products as any, getComparator(order, orderBy)).map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.Varenummer}
                      onClick={() => handleProductClick(row.Varenummer)}
                    >
                      <TableCell component="th" id={labelId} padding="default" align="left">
                        {row.Varenavn}
                      </TableCell>
                      <TableCell align="right">{row.Varetype}</TableCell>
                      <TableCell align="right" className={classes.volum}>
                        {row.Volum}
                      </TableCell>
                      <TableCell align="right" className={classes.pris}>
                        {row.Pris}
                      </TableCell>
                      <TableCell align="right" className={classes.produsent}>
                        {row.Produsent}{' '}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default ProductListView;

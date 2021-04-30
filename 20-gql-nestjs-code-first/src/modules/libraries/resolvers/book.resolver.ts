import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Book } from '../gql-types/book.gql-type';
import { Author } from '../gql-types/author.gql-type';
import {
  AuthorModelDataModel,
  authors,
  BookModelDataModel,
} from '../../../mocks/data.mocks';
import { books } from '../../../mocks/data.mocks';
import { BookGqlMutationArgsType } from '../gql-types/book.gql-mutation-args-type';

@Resolver(() => Book)
export class BookResolver {
  @Query(() => [Book])
  books(@Args('id', { nullable: true }) bookId: string): BookModelDataModel[] {
    if (bookId) {
      return [books.find((book) => book.id === bookId)];
    }
    return books;
  }

  @ResolveField(() => Author)
  author(@Parent() book: BookModelDataModel): AuthorModelDataModel {
    return authors.find((author) => book.author_id === author.id);
  }

  @Mutation(() => Book, { nullable: true })
  changeTitle(
    @Args() mutationArgsType: BookGqlMutationArgsType,
  ): BookModelDataModel {
    const old = books.find((book) => book.title === mutationArgsType.oldTitle);
    if (old) {
      old.title = mutationArgsType.newTitle;
      return old;
    }

    return null;
  }
}

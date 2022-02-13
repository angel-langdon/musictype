from sqlmodel.sql.expression import Select, SelectOfScalar  # noqa

SelectOfScalar.inherit_cache = True  # type: ignore # noqa
Select.inherit_cache = True  # type: ignore # noqa

from sqlmodel import select  # noqa
